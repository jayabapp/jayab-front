import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  IMAGE_UPLOAD_MAX_BYTES,
  IMAGE_UPLOAD_TIMEOUT_MS,
  ImageUploadValidationError,
  imageUploadMaxDimension,
  prepareImageUpload,
} from "./image-upload";
import { uploadErrorKey } from "./upload-error";

describe("high resolution image uploads", () => {
  it("preserves the original file and bytes above the old 4 MiB compression threshold", async () => {
    const bytes = new Uint8Array(5 * 1024 * 1024).fill(127);
    const file = new File([bytes], "high.quality.image.jpg", {
      type: "image/jpeg",
    });
    assert.equal(prepareImageUpload(file), file);
    assert.deepEqual(new Uint8Array(await file.arrayBuffer()), bytes);
    assert.equal(IMAGE_UPLOAD_TIMEOUT_MS, 180_000);
  });

  it("accepts the backend's full 30 MiB allowance and rejects larger files before uploading", () => {
    const limit = new File(
      [new Uint8Array(IMAGE_UPLOAD_MAX_BYTES)],
      "limit.png",
      { type: "image/png" },
    );
    assert.equal(prepareImageUpload(limit), limit);
    const large = new File([limit, new Uint8Array(1)], "large.png", {
      type: "image/png",
    });
    assert.throws(
      () => prepareImageUpload(large),
      (error) =>
        error instanceof ImageUploadValidationError && error.code === "size",
    );
  });

  it("accepts JFIF/JPEG and normalizes a missing or legacy MIME without re-encoding", async () => {
    for (const type of ["", "image/pjpeg", "image/jfif", "image/jpeg"]) {
      const file = new File(["unchanged source"], "camera.export.JFIF", {
        type,
      });
      const prepared = prepareImageUpload(file);
      assert.equal(prepared.type, "image/jpeg");
      assert.equal(await prepared.text(), "unchanged source");
    }
    assert.throws(
      () =>
        prepareImageUpload(
          new File(["heic"], "camera.heic", { type: "image/heic" }),
        ),
      ImageUploadValidationError,
    );
    assert.throws(
      () =>
        prepareImageUpload(new File([], "empty.jpg", { type: "image/jpeg" })),
      ImageUploadValidationError,
    );
  });

  it("keeps the advertised output limits consistent across the affected upload types", () => {
    for (const type of ["PROFILE", "OWNER_SELFIE_IMAGE"]) {
      assert.equal(imageUploadMaxDimension(`/attachments?type=${type}`), 1024);
    }
    for (const type of [
      "ADVISOR_NATIONAL_CARD_IMAGE",
      "ADVISOR_DOCUMENT_IMAGE",
      "OWNER_PROPERTY_DOCS",
    ]) {
      assert.equal(imageUploadMaxDimension(`/attachments?type=${type}`), 2560);
    }
    assert.equal(
      imageUploadMaxDimension("/attachments?type=OWNER_PROPERTY_IMAGE"),
      1600,
    );
  });
});

describe("actionable upload errors", () => {
  it("preserves HTTP status and backend image error codes from the API envelope", () => {
    const error = { messages: { fa: "large" } };
    Object.defineProperty(error, "httpStatus", {
      value: 413,
      enumerable: false,
    });
    assert.equal(uploadErrorKey(error), "imageTooLarge");
    assert.equal(
      uploadErrorKey({
        statusCode: 400,
        message_code: "ATTACH_IMAGE_PIXEL_LIMIT",
      }),
      "imageUploadPixelLimit",
    );
    assert.equal(
      uploadErrorKey({ statusCode: 400, message_code: "ATTACH2" }),
      "imageUploadTooSmall",
    );
    assert.equal(
      uploadErrorKey({ statusCode: 400, message_code: "ATTACH_IMAGE_INVALID" }),
      "imageUploadInvalid",
    );
    assert.equal(uploadErrorKey({ statusCode: 415 }), "imageUploadUnsupported");
  });

  it("distinguishes upload timeout, cancellation, and a genuine failure", () => {
    const timeout = Object.assign(new Error("timeout"), {
      isAxiosError: true,
      code: "ECONNABORTED",
    });
    assert.equal(uploadErrorKey(timeout), "imageUploadTimeout");
    assert.equal(uploadErrorKey({ __CANCEL__: true }), null);
    assert.equal(uploadErrorKey(new Error("unexpected")), "imageUploadFailed");
  });
});
