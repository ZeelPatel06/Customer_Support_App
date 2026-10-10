import {useMutation} from "@tanstack/react-query";
import { sendChatMessageAPI, clearChatAPI } from "../apis/chatAPI";

export const useSendChatMessage = () => {
    return useMutation({
        mutationFn: sendChatMessageAPI,
    });
};

export const useClearChat = () => {
    return useMutation({
        mutationFn: clearChatAPI,
    });
};