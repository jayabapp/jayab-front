export type UploadFieldClasses = {
  sizeClass?: string;
  imageClass?: string;
  secontParentClass?: string;
};

export type UploadFieldProps = {
  item: any;
  link: string;
  type?: string;
  title?: string;
  disabled?: boolean;
  withCrop?: boolean;
  cropRatio?: number;
  showCamera?: boolean;
  onDelete?: () => void;
  containerClass?: string;
  onSelect: (file: any) => void;
  innerClasses?: UploadFieldClasses;
};

export type AuthUploadFieldProps = Omit<UploadFieldProps, "onDelete"> & {
  onDelete: () => void;
};

export type ChatUploadFieldProps = AuthUploadFieldProps & {
  chatId: string | number;
  sendMessage: (
    body: {
      id: string | number;
      media_id?: number;
      optimisticMedia?: any;
      text: string;
    },
    options?: {
      onError?: (error: unknown) => void;
      onSuccess?: (response: unknown) => void;
    },
  ) => void;
};

export type UploadMediaItem = {
  data?: any;
  url?: string;
  id?: number | string;
};

export type MultiImageUploadProps = {
  item: any;
  link: string;
  loading?: boolean;
  disabled?: boolean;
  activeFull?: boolean;
  onDelete?: () => void;
  containerClass?: string;
  images: UploadMediaItem[];
  innerClasses?: UploadFieldClasses;
  imagesLoadings: Record<string, number>;
  setImages: React.Dispatch<React.SetStateAction<UploadMediaItem[]>>;
  setimagesLoadings: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  type?: string;
  title?: string;
};

export type UploadedMediaItemProps = {
  cb?: () => void;
  progress: number;
  onDelete?: () => void;
  containerClass?: string;
  innerClasses?: UploadFieldClasses;
  item: UploadMediaItem;
};

export type TEditCreateProps = {
  values: {
    name: string;
    national_code: string;
    image: any;
  };
  onChange: (value: string | number | null, key: string) => void;
};
