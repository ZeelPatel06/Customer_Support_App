(() => {
    // =========================================================
    // PREVENT MULTIPLE INITIALIZATION
    // =========================================================

    if (window.__AI_CHATBOT_LOADED__) {
        console.warn("CusSup Chatbot is already loaded.");
        return;
    }

    window.__AI_CHATBOT_LOADED__ = true;

    // =========================================================
    // SCRIPT CONFIGURATION
    // =========================================================

    const script = document.currentScript;

    if (!script) {
        console.error("CusSup Chatbot could not identify itself.");
        return;
    }

    const publicKey = script.dataset.publicKey;

    if (!publicKey) {
        console.error("Chatbot public key is required.");
        return;
    }

    // Keep this as your current backend URL.
    // Change it to your Render URL when deploying.
    const API_BASE_URL =
        "http://localhost:5000/api/v1/chat" || "https://customer-support-app-o39e.onrender.com";

    let sessionId = null;

    // =========================================================
    // CREATE WIDGET SESSION
    // =========================================================

    const createWidgetSession = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/session`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        publicKey,
                        environment: "test",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    code: data.code,
                    message:
                        data.message ||
                        "Unable to connect to support.",
                };
            }

            sessionId = data.data.sessionId;

            return {
                success: true,
            };
        } catch (error) {
            console.error(
                "Widget session error:",
                error
            );

            return {
                success: false,
                code: "NETWORK_ERROR",
                message:
                    "Unable to connect to support right now.",
            };
        }
    };

    // =========================================================
    // CREATE WIDGET UI
    // =========================================================

    const createWidgetUI = () => {
        const container = document.createElement("div");

        container.innerHTML = `
            <div id="ai-chatbot-widget">

                <!-- FLOATING BUTTON -->
                <button
                    id="ai-chatbot-button"
                    type="button"
                    aria-label="Open CusSup support"
                >
                    <svg
                        class="cus-sup-headset-icon"
                        viewBox="0 0 64 64"
                        aria-hidden="true"
                    >
                        <path
                            d="M14 33v-5C14 17.5 22.5 9 33 9s19 8.5 19 19v5"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="5"
                            stroke-linecap="round"
                        />

                        <path
                            d="M13 32h7c3 0 5 2 5 5v9c0 3-2 5-5 5h-4c-4 0-7-3-7-7v-5c0-4 2-7 4-7Z"
                            fill="currentColor"
                        />

                        <path
                            d="M53 32h-7c-3 0-5 2-5 5v9c0 3 2 5 5 5h4c4 0 7-3 7-7v-5c0-4-2-7-4-7Z"
                            fill="currentColor"
                        />

                        <path
                            d="M46 51c-2 4-6 6-11 6h-5"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="4"
                            stroke-linecap="round"
                        />

                        <circle
                            cx="27"
                            cy="57"
                            r="3"
                            fill="currentColor"
                        />
                    </svg>
                </button>


                <!-- CHAT WINDOW -->
                <div id="ai-chatbot-window">

                    <!-- HEADER -->
                    <div id="ai-chatbot-header">

                        <div class="cus-sup-brand">

                            <div
                                class="cus-sup-logo"
                                aria-hidden="true"
                            >
                                <svg viewBox="0 0 64 64">
                                    <path
                                        d="M14 33v-5C14 17.5 22.5 9 33 9s19 8.5 19 19v5"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="5"
                                        stroke-linecap="round"
                                    />

                                    <path
                                        d="M13 32h7c3 0 5 2 5 5v9c0 3-2 5-5 5h-4c-4 0-7-3-7-7v-5c0-4 2-7 4-7Z"
                                        fill="currentColor"
                                    />

                                    <path
                                        d="M53 32h-7c-3 0-5 2-5 5v9c0 3 2 5 5 5h4c4 0 7-3 7-7v-5c0-4-2-7-4-7Z"
                                        fill="currentColor"
                                    />

                                    <path
                                        d="M46 51c-2 4-6 6-11 6h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="4"
                                        stroke-linecap="round"
                                    />

                                    <circle
                                        cx="27"
                                        cy="57"
                                        r="3"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>

                            <span>CusSup-AI</span>

                        </div>


                        <div id="ai-chatbot-header-actions">

                            <button
                                id="ai-chatbot-clear"
                                type="button"
                            >
                                Clear
                            </button>

                            <button
                                id="ai-chatbot-close"
                                type="button"
                                aria-label="Close chat"
                            >
                                ×
                            </button>

                        </div>

                    </div>


                    <!-- MESSAGES -->
                    <div id="ai-chatbot-messages"></div>


                    <!-- INPUT -->
                    <div id="ai-chatbot-input-container">

                        <div id="ai-chatbot-input-row">

                            <input
                                id="ai-chatbot-input"
                                type="text"
                                placeholder="Ask a question..."
                                autocomplete="off"
                            />

                            <button
                                id="ai-chatbot-send"
                                type="button"
                            >
                                Send
                            </button>

                        </div>

                        <div id="ai-chatbot-disclaimer">
                            AI can make mistakes. Please verify important information.
                        </div>

                    </div>

                </div>

            </div>
        `;

        document.body.appendChild(container);

        // =====================================================
        // STYLES
        // =====================================================

        const style = document.createElement("style");

        style.textContent = `

            /* =================================================
               MAIN WIDGET
            ================================================= */

            #ai-chatbot-widget {
                position: fixed;

                right: 24px;
                bottom: 24px;

                z-index: 999999;

                font-family:
                    Inter,
                    -apple-system,
                    BlinkMacSystemFont,
                    "Segoe UI",
                    Roboto,
                    sans-serif;

                max-width: 100vw;
            }


            /* =================================================
               FLOATING BUTTON
            ================================================= */

            #ai-chatbot-button {
                width: 62px;
                height: 62px;

                border: none;
                border-radius: 50%;

                cursor: pointer;

                display: flex;
                align-items: center;
                justify-content: center;

                color: white;

                background:
                    linear-gradient(
                        135deg,
                        #6366f1,
                        #8b5cf6
                    );

                box-shadow:
                    0 10px 30px rgba(99, 102, 241, 0.35),
                    0 4px 12px rgba(0, 0, 0, 0.15);

                transition:
                    transform 0.2s ease,
                    box-shadow 0.2s ease;
            }


            #ai-chatbot-button:hover {
                transform:
                    translateY(-3px)
                    scale(1.03);

                box-shadow:
                    0 14px 35px rgba(99, 102, 241, 0.45),
                    0 6px 15px rgba(0, 0, 0, 0.18);
            }


            #ai-chatbot-button:active {
                transform: scale(0.96);
            }


            .cus-sup-headset-icon {
                width: 32px;
                height: 32px;
            }


            /* =================================================
               CHAT WINDOW
               
               IMPORTANT:
               CSS GRID keeps:
               HEADER   -> top
               MESSAGES -> middle
               INPUT    -> bottom
            ================================================= */

            #ai-chatbot-window {
                display: none;

                position: absolute;

                right: 0;
                bottom: 78px;

                width: 380px;

                /*
                    NEVER exceed viewport height.
                    This prevents the window from going upward.
                */
                height:
                    min(
                        560px,
                        calc(100vh - 110px)
                    );

                max-height:
                    calc(100vh - 110px);

                min-height: 380px;

                background: #ffffff;

                border-radius: 20px;

                overflow: hidden;

                border:
                    1px solid
                    rgba(0, 0, 0, 0.08);

                box-shadow:
                    0 25px 70px rgba(0, 0, 0, 0.20),
                    0 8px 25px rgba(0, 0, 0, 0.10);

                box-sizing: border-box;

                /*
                    HEADER
                    MESSAGES
                    INPUT
                */
                grid-template-rows:
                    72px
                    minmax(0, 1fr)
                    auto;

                animation:
                    chatbotOpen
                    0.22s
                    ease-out;
            }


            @keyframes chatbotOpen {

                from {
                    opacity: 0;

                    transform:
                        translateY(12px)
                        scale(0.97);
                }

                to {
                    opacity: 1;

                    transform:
                        translateY(0)
                        scale(1);
                }
            }


            /* =================================================
               HEADER
            ================================================= */

            #ai-chatbot-header {
                height: 72px;
                min-height: 72px;

                display: flex;

                align-items: center;

                justify-content: space-between;

                padding:
                    0 18px;

                color: white;

                background:
                    linear-gradient(
                        135deg,
                        #4f46e5,
                        #7c3aed
                    );

                box-sizing: border-box;
            }


            .cus-sup-brand {
                display: flex;

                align-items: center;

                gap: 10px;

                color: white;

                font-size: 16px;

                font-weight: 650;

                letter-spacing: -0.2px;
            }


            .cus-sup-logo {
                width: 34px;
                height: 34px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 10px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.16
                    );

                color: white;
            }


            .cus-sup-logo svg {
                width: 23px;
                height: 23px;
            }


            #ai-chatbot-header-actions {
                display: flex;

                align-items: center;

                gap: 6px;
            }


            /* =================================================
               CLEAR BUTTON
            ================================================= */

            #ai-chatbot-clear {
                height: 34px;

                border: none;

                border-radius: 10px;

                padding:
                    0 10px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.12
                    );

                color: white;

                font-size: 12px;

                font-weight: 600;

                cursor: pointer;

                transition:
                    background 0.2s ease,
                    transform 0.2s ease;
            }


            #ai-chatbot-clear:hover {
                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.22
                    );
            }


            #ai-chatbot-clear:active {
                transform: scale(0.96);
            }


            #ai-chatbot-clear:disabled {
                opacity: 0.55;

                cursor: not-allowed;
            }


            /* =================================================
               CLOSE BUTTON
            ================================================= */

            #ai-chatbot-close {
                width: 34px;
                height: 34px;

                border: none;

                border-radius: 10px;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.12
                    );

                color: white;

                font-size: 22px;

                cursor: pointer;

                display: flex;

                align-items: center;

                justify-content: center;

                transition:
                    background 0.2s ease,
                    transform 0.2s ease;
            }


            #ai-chatbot-close:hover {
                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.22
                    );

                transform: rotate(90deg);
            }


            /* =================================================
               MESSAGES
               
               THIS IS THE IMPORTANT PART.

               The messages area takes all remaining
               available space.

               The input cannot move upward.
            ================================================= */

            #ai-chatbot-messages {
                min-height: 0;

                width: 100%;

                padding: 18px;

                overflow-y: auto;

                background:
                    linear-gradient(
                        180deg,
                        #f8f9ff 0%,
                        #f9fafb 100%
                    );

                box-sizing: border-box;

                scroll-behavior: smooth;
            }


            #ai-chatbot-messages::-webkit-scrollbar {
                width: 5px;
            }


            #ai-chatbot-messages::-webkit-scrollbar-track {
                background: transparent;
            }


            #ai-chatbot-messages::-webkit-scrollbar-thumb {
                background: #d1d5db;

                border-radius: 10px;
            }


            /* =================================================
               MESSAGE BUBBLES
            ================================================= */

            .ai-chatbot-message {
                width: fit-content;

                max-width: 82%;

                margin-bottom: 12px;

                padding:
                    11px 14px;

                border-radius: 15px;

                font-size: 14px;

                line-height: 1.5;

                word-break: break-word;

                animation:
                    messageAppear
                    0.18s
                    ease-out;
            }


            @keyframes messageAppear {

                from {
                    opacity: 0;

                    transform:
                        translateY(5px);
                }

                to {
                    opacity: 1;

                    transform:
                        translateY(0);
                }
            }


            /* AI MESSAGE */

            .ai-chatbot-bot {
                margin-right: auto;

                color: #1f2937;

                background: #ffffff;

                border:
                    1px solid
                    #e5e7eb;

                border-bottom-left-radius: 5px;

                box-shadow:
                    0 2px 8px
                    rgba(0, 0, 0, 0.04);
            }


            /* USER MESSAGE */

            .ai-chatbot-user {
                margin-left: auto;

                color: white;

                background:
                    linear-gradient(
                        135deg,
                        #6366f1,
                        #7c3aed
                    );

                border-bottom-right-radius: 5px;

                box-shadow:
                    0 4px 12px
                    rgba(
                        99,
                        102,
                        241,
                        0.18
                    );
            }


            /* =================================================
               INPUT CONTAINER
               
               This is the bottom grid row.
            ================================================= */

            #ai-chatbot-input-container {
                width: 100%;

                display: flex;

                flex-direction: column;

                gap: 5px;

                padding:
                    8px 10px 9px;

                background: #ffffff;

                border-top:
                    1px solid
                    #e5e7eb;

                box-sizing: border-box;

                flex-shrink: 0;
            }


            #ai-chatbot-input-row {
                width: 100%;

                display: flex;

                align-items: center;

                gap: 8px;

                box-sizing: border-box;
            }


            /* =================================================
               INPUT
            ================================================= */

            #ai-chatbot-input {
                flex: 1;

                min-width: 0;

                height: 42px;

                border:
                    1px solid
                    #e5e7eb;

                border-radius: 12px;

                padding:
                    0 13px;

                outline: none;

                color: #111827;

                background: #f9fafb;

                font-size: 14px;

                transition:
                    border-color 0.2s ease,
                    box-shadow 0.2s ease,
                    background 0.2s ease;

                box-sizing: border-box;
            }


            #ai-chatbot-input::placeholder {
                color: #9ca3af;
            }


            #ai-chatbot-input:focus {
                background: #ffffff;

                border-color: #6366f1;

                box-shadow:
                    0 0 0 3px
                    rgba(
                        99,
                        102,
                        241,
                        0.10
                    );
            }


            /* =================================================
               SEND BUTTON
            ================================================= */

            #ai-chatbot-send {
                height: 42px;

                border: none;

                border-radius: 12px;

                padding:
                    0 16px;

                cursor: pointer;

                color: white;

                font-size: 13px;

                font-weight: 600;

                background:
                    linear-gradient(
                        135deg,
                        #6366f1,
                        #7c3aed
                    );

                transition:
                    transform 0.2s ease,
                    box-shadow 0.2s ease,
                    opacity 0.2s ease;

                box-shadow:
                    0 4px 12px
                    rgba(
                        99,
                        102,
                        241,
                        0.20
                    );
            }


            #ai-chatbot-send:hover {
                transform:
                    translateY(-1px);

                box-shadow:
                    0 6px 16px
                    rgba(
                        99,
                        102,
                        241,
                        0.28
                    );
            }


            #ai-chatbot-send:active {
                transform:
                    scale(0.97);
            }


            #ai-chatbot-send:disabled {
                opacity: 0.55;

                cursor: not-allowed;

                transform: none;
            }


            /* =================================================
               DISCLAIMER
            ================================================= */

            #ai-chatbot-disclaimer {
                width: 100%;

                text-align: center;

                font-size: 10px;

                line-height: 1.3;

                color: #9ca3af;

                box-sizing: border-box;
            }


            /* =================================================
               ERROR STATE
            ================================================= */

            .ai-chatbot-error {
                height: 100%;

                display: flex;

                flex-direction: column;

                align-items: center;

                justify-content: center;

                text-align: center;

                padding: 30px;

                box-sizing: border-box;
            }


            .ai-chatbot-error-icon {
                width: 58px;
                height: 58px;

                display: flex;

                align-items: center;

                justify-content: center;

                margin-bottom: 16px;

                border-radius: 50%;

                background: #fee2e2;

                color: #dc2626;

                font-size: 30px;

                font-weight: 700;

                border:
                    1px solid
                    #fecaca;
            }


            .ai-chatbot-error-message {
                max-width: 260px;

                color: #dc2626;

                font-size: 14px;

                font-weight: 600;

                line-height: 1.5;
            }


            /* =================================================
               MOBILE
            ================================================= */

            @media (max-width: 480px) {

                #ai-chatbot-widget {
                    right: 15px;
                    bottom: 15px;
                }


                #ai-chatbot-window {
                    right: -5px;

                    bottom: 75px;

                    width:
                        calc(100vw - 30px);

                    height:
                        min(
                            650px,
                            calc(100vh - 100px)
                        );

                    max-height:
                        calc(100vh - 100px);

                    min-height: 360px;

                    border-radius: 18px;

                    grid-template-rows:
                        72px
                        minmax(0, 1fr)
                        auto;
                }


                #ai-chatbot-button {
                    width: 58px;
                    height: 58px;
                }


                #ai-chatbot-input {
                    font-size: 14px;
                }


                #ai-chatbot-send {
                    padding:
                        0 14px;
                }
            }

        `;

        document.head.appendChild(style);

        return {
            button:
                document.getElementById(
                    "ai-chatbot-button"
                ),

            window:
                document.getElementById(
                    "ai-chatbot-window"
                ),

            close:
                document.getElementById(
                    "ai-chatbot-close"
                ),

            clear:
                document.getElementById(
                    "ai-chatbot-clear"
                ),

            messages:
                document.getElementById(
                    "ai-chatbot-messages"
                ),

            input:
                document.getElementById(
                    "ai-chatbot-input"
                ),

            send:
                document.getElementById(
                    "ai-chatbot-send"
                ),
        };
    };


    // =========================================================
    // ADD MESSAGE
    // =========================================================

    const addMessage = (
        messagesContainer,
        text,
        type
    ) => {

        if (!messagesContainer) {
            console.error(
                "Chatbot messages container is missing."
            );

            return null;
        }

        const message =
            document.createElement("div");

        message.className =
            `ai-chatbot-message ai-chatbot-${type}`;

        message.textContent = text;

        messagesContainer.appendChild(message);

        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;

        return message;
    };


    // =========================================================
    // ERROR MESSAGE
    // =========================================================

    const showWidgetError = (
        elements,
        message
    ) => {

        elements.messages.innerHTML = "";

        const errorContainer =
            document.createElement("div");

        errorContainer.className =
            "ai-chatbot-error";

        errorContainer.innerHTML = `
            <div class="ai-chatbot-error-icon">
                ⚠
            </div>

            <div class="ai-chatbot-error-message">
                ${message}
            </div>
        `;

        elements.messages.appendChild(
            errorContainer
        );

        elements.input.disabled = true;

        elements.send.disabled = true;

        elements.input.placeholder =
            "Chat unavailable";

        const inputContainer =
            document.getElementById(
                "ai-chatbot-input-container"
            );

        if (inputContainer) {
            inputContainer.style.display =
                "none";
        }
    };


    // =========================================================
    // CLEAR CONVERSATION
    // =========================================================

    const clearConversation = async (
        elements
    ) => {

        try {

            elements.clear.disabled = true;

            const sessionResult =
                await createWidgetSession();

            if (!sessionResult.success) {
                throw new Error(
                    sessionResult.message ||
                    "Unable to start a new conversation."
                );
            }


            // Clear old messages
            elements.messages.innerHTML = "";


            // Restore input if error state
            const inputContainer =
                document.getElementById(
                    "ai-chatbot-input-container"
                );

            if (inputContainer) {
                inputContainer.style.display =
                    "flex";
            }


            elements.input.value = "";

            elements.input.disabled = false;

            elements.send.disabled = false;

            elements.input.placeholder =
                "Ask a question...";


            // New greeting
            addMessage(
                elements.messages,
                "Hi! I'm CusSup. How can I help you?",
                "bot"
            );


            elements.input.focus();

        } catch (error) {

            console.error(
                "Clear conversation error:",
                error
            );

        } finally {

            elements.clear.disabled = false;
        }
    };


    // =========================================================
    // SEND MESSAGE
    // =========================================================

    const sendMessage = async ({
        input,
        send,
        messages,
    }) => {

        const message =
            input.value.trim();


        if (!message || !sessionId) {
            return;
        }


        input.value = "";


        // Add user message
        addMessage(
            messages,
            message,
            "user"
        );


        send.disabled = true;


        // Loading message
        const loadingMessage =
            addMessage(
                messages,
                "Thinking...",
                "bot"
            );


        if (!loadingMessage) {
            send.disabled = false;
            return;
        }


        try {

            let response =
                await fetch(
                    `${API_BASE_URL}/widget`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${sessionId}`,
                        },

                        body: JSON.stringify({
                            message,
                        }),
                    }
                );


            /*
             * Session expired or revoked.
             *
             * Create a new session and retry once.
             */

            if (response.status === 401) {

                const sessionResult =
                    await createWidgetSession();


                if (!sessionResult.success) {
                    throw new Error(
                        sessionResult.message ||
                        "Unable to create a new widget session"
                    );
                }


                response =
                    await fetch(
                        `${API_BASE_URL}/widget`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${sessionId}`,
                            },

                            body: JSON.stringify({
                                message,
                            }),
                        }
                    );
            }


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to get response"
                );
            }


            // Replace Thinking...
            loadingMessage.textContent =
                data.data.answer;

        } catch (error) {

            console.error(
                "Chatbot message error:",
                error
            );


            loadingMessage.textContent =
                "Sorry, I couldn't process your message. Please try again.";

        } finally {

            send.disabled = false;

            input.focus();
        }
    };


    // =========================================================
    // INITIALIZE WIDGET
    // =========================================================

    const initializeWidget = () => {

        const elements =
            createWidgetUI();


        // =====================================================
        // OPEN CHAT
        // =====================================================

        elements.button.addEventListener(
            "click",
            async () => {

                if (!sessionId) {

                    elements.button.disabled =
                        true;


                    const sessionResult =
                        await createWidgetSession();


                    elements.button.disabled =
                        false;


                    if (!sessionResult.success) {

                        /*
                         * Show error window.
                         *
                         * This uses block only for
                         * the error state.
                         */

                        elements.window.style.display =
                            "block";


                        showWidgetError(
                            elements,
                            sessionResult.message
                        );

                        return;
                    }
                }


                /*
                 * IMPORTANT:
                 *
                 * Normal chat window uses GRID.
                 *
                 * This makes:
                 *
                 * HEADER
                 * MESSAGES
                 * INPUT
                 *
                 * stay in their correct positions.
                 */

                elements.window.style.display =
                    "grid";


                elements.input.focus();
            }
        );


        // =====================================================
        // CLOSE CHAT
        // =====================================================

        elements.close.addEventListener(
            "click",
            () => {

                elements.window.style.display =
                    "none";
            }
        );


        // =====================================================
        // CLEAR CHAT
        // =====================================================

        elements.clear.addEventListener(
            "click",
            () => {

                clearConversation(
                    elements
                );
            }
        );


        // =====================================================
        // SEND BUTTON
        // =====================================================

        elements.send.addEventListener(
            "click",
            () => {

                sendMessage(elements);
            }
        );


        // =====================================================
        // ENTER TO SEND
        // =====================================================

        elements.input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage(elements);
                }
            }
        );


        // =====================================================
        // INITIAL GREETING
        // =====================================================

        addMessage(
            elements.messages,
            "Hi! I'm CusSup. How can I help you?",
            "bot"
        );
    };


    // =========================================================
    // START WIDGET
    // =========================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeWidget
        );

    } else {

        initializeWidget();
    }

})();