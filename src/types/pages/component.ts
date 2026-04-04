export interface ToastProps {
    show?: boolean;
    title?: string;
    fields?: ToastInputField[];
    /** 表单项未指定 icon 时的默认类名（如 icon-Edit）；传 `''` 则默认不显示行尾图标 */
    icon?: string;
    /** 表单项未指定 iconColor 时的默认类；传 `''` 则不加颜色类 */
    iconColor?: string;
    placeholder?: string;
    cancelText?: string;
    confirmText?: string;
    maskClosable?: boolean;
    defaultValue?: string;
    required?: boolean;
};

/** 确定 / 取消 文案弹窗（无输入） */
export interface ConfirmDialogProps {
    show?: boolean;
    title?: string;
    /** 正文，支持换行（\n） */
    message?: string;
    cancelText?: string;
    confirmText?: string;
    /** 点遮罩是否关闭（默认 false，避免误触） */
    maskClosable?: boolean;
    /** 是否显示右上角关闭 */
    showClose?: boolean;
}

/** 全屏或居中加载遮罩 */
export interface LoadingOverlayProps {
    show?: boolean;
    /** 提示文案，空则不显示第二行 */
    text?: string;
    /** 是否显示半透明遮罩（默认 true） */
    mask?: boolean;
}

export type ToastInputField = {
    /** 表单键，confirm 时作为对象的 key */
    key: string;
    /** 不传或仅空白不展示标题行 */
    label?: string;
    /** 不传用组件级 icon；传 `''` 不显示行尾图标 */
    icon?: string;
    /** 不传用组件级 iconColor；传 `''` 不加颜色类 */
    iconColor?: string;
    placeholder?: string;
    defaultValue?: string;
    disabled?: boolean;
    /** 未设置时沿用组件级 required */
    required?: boolean;
};