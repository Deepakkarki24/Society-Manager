export const getComplaintPayload = (message: string, image: File | null, currentSessionId: string) => {
    const formData = new FormData()
    if (image) {
        formData.append("image", image, "image.png")
    }

    formData.append("message", message)
    formData.append("sessionId", currentSessionId)

    return formData;
}