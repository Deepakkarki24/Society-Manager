export const getComplaintPayload = (message: string, image: File | null) => {
    const formData = new FormData()
    if (image) {
        formData.append("image", image, "image.png")
    }

    formData.append("message", message)

    return formData;
}