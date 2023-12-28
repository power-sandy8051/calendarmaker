import axios from "axios";

const client = async (prompt) => {

    let imagesUrls = [];

    for (let i = 0; i < 3; i++) {
        const data = {
            "prompt": `High Quality Safe Image on theme of ${prompt}`,
            "n": 4,
            "size": "1024x1024"
        };

        let response = await axios.post(`https://${process.env.REACT_APP_AZOPENAI_RESOURCE_NAME}.openai.azure.com/openai/images/generations:submit?api-version=${process.env.REACT_APP_AZOPENAI_API_VERSION}`, data, {
            headers: {
                "api-key": `${process.env.REACT_APP_AZOPENAI_API_KEY}`
            }
        });

        let id = response.data.id;

        while (true) {
            let image = await axios.get(`https://${process.env.REACT_APP_AZOPENAI_RESOURCE_NAME}.openai.azure.com/openai/operations/images/${id}?api-version=${process.env.REACT_APP_AZOPENAI_API_VERSION}`, {
                headers: {
                    "api-key": `${process.env.REACT_APP_AZOPENAI_API_KEY}`
                }
            });
            if (image.data.status === "succeeded") {
                imagesUrls = imagesUrls.concat(image.data.result.data);
                break;
            }
        }
    }
    return imagesUrls;
}

export default client;