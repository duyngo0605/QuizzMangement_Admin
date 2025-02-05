import { signify } from "react-signify";
import { getTopic } from "./services/topicService";

export const sLoading = signify(false);

export const sTopics = signify([]);

export const fetchTopics = async () => {
    try {
        sLoading.set(true);
        const topicData = await getTopic();
        sTopics.set(topicData);
        sLoading.set(false)
    }
    catch (e)
    {
        console.log("Error fetching topic:", e);
    }
}