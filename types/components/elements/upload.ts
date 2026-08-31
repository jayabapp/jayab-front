export type FullscreenImageProps = {
  src: string;
  show: boolean;
  isNew?: boolean;
  onDelete?: () => void;
  setShow: (show: boolean) => void;
};

export type ImageCropModalProps = {
  imageUrl: string;
  cropRatio?: number;
  onHide: () => void;
  isUploading: boolean;
  onComplete: (image: File) => void;
};
