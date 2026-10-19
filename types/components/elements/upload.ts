export type FullscreenImageProps = {
  src: string;
  show: boolean;
  isNew?: boolean;
  onDelete?: () => void;
  setShow: (show: boolean) => void;
};

export type ImageCropModalProps = {
  imageUrl: string;
  onHide: () => void;
  cropRatio?: number;
  maxDimension?: number;
  isUploading: boolean;
  onComplete: (image: File) => void;
};
