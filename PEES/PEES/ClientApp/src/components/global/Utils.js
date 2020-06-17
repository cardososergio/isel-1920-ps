export const Toast = (text, type, fixed) => {
    if (type === undefined) type = ToastTypes.Info
    if (fixed === undefined) fixed = false

    return { type: "ALERT", payload: { show: true, text: text, color: type, fixed: fixed } }
}

export const ToastTypes = {
    Success: "success",
    Danger: "danger",
    Warning: "warning",
    Info: "info"
}

export const HideToast = () => {
    return { type: "UNMOUNT_ALERT" }
}
