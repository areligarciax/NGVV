document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggleButton = document.getElementById('chatbot-toggle-button');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseButton = document.getElementById('chatbot-close-button');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendButton = document.getElementById('chatbot-send-button');

    chatbotToggleButton.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
        if (!chatbotWindow.classList.contains('hidden')) {
            // Envía un mensaje de bienvenida cuando se abre el chat
            addBotMessage("¡Hola! Soy tu asistente de moda. ¿En qué puedo ayudarte hoy?");
        }
    });

    chatbotCloseButton.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
    });

    chatbotSendButton.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage === '') return;

        addUserMessage(userMessage);
        chatbotInput.value = '';

        // Aquí es donde harías la llamada a tu backend/API del chatbot
        // Por ahora, simularemos una respuesta
        setTimeout(() => {
            getBotResponse(userMessage);
        }, 500); // Pequeño delay para simular procesamiento
    }

    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', 'user');
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', 'bot');
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // --- Simulación de Respuestas del Chatbot (REEMPLAZAR CON TU BACKEND REAL) ---
    function getBotResponse(userMessage) {
        userMessage = userMessage.toLowerCase();
        let botReply = "Disculpa, no entendí tu pregunta. ¿Puedes reformularla o preguntar algo sobre productos, tallas o envíos?";

        if (userMessage.includes("hola") || userMessage.includes("saludo")) {
            botReply = "¡Hola! ¿Cómo puedo ayudarte con tu compra hoy?";
        } else if (userMessage.includes("productos") || userMessage.includes("que venden")) {
            botReply = "Tenemos una amplia variedad de ropa para hombre y mujer: vestidos, camisas, pantalones, accesorios y más. ¿Buscas algo en particular?";
        } else if (userMessage.includes("envío") || userMessage.includes("envios") || userMessage.includes("entrega")) {
            botReply = "Ofrecemos envío estándar y express. El envío estándar tarda de 3-5 días hábiles. Puedes ver más detalles en nuestra sección de 'Envíos'.";
        } else if (userMessage.includes("tallas") || userMessage.includes("talla")) {
            botReply = "Contamos con tallas desde XS hasta XL en la mayoría de nuestros productos. Te recomiendo revisar la guía de tallas en cada página de producto para mayor precisión.";
        } else if (userMessage.includes("devoluciones") || userMessage.includes("devolver")) {
            botReply = "Sí, aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre y cuando el producto esté en su estado original. Consulta nuestra política de devoluciones para más información.";
        } else if (userMessage.includes("contacto") || userMessage.includes("soporte")) {
            botReply = "Puedes contactarnos a través de nuestro formulario en la sección de 'Contacto' o enviando un correo a soporte@tutienda.com.";
        } else if (userMessage.includes("gracias")) {
            botReply = "De nada, ¡un placer ayudarte! ¿Hay algo más en lo que pueda asistirte?";
        } else if (userMessage.includes("adiós") || userMessage.includes("hasta luego")) {
            botReply = "¡Hasta pronto! Que tengas un excelente día.";
        } else if (userMessage.includes("blog")) {
            botReply = "Nuestro blog tiene artículos sobre las últimas tendencias, consejos de estilo y novedades. ¡Te invito a echarle un vistazo!";
        } else if (userMessage.includes("novedades")) {
            botReply = "Constantemente actualizamos nuestra colección con las últimas novedades. ¡Visita nuestra sección de 'Novedades' para no perderte nada!";
        } else if (userMessage.includes("mujer")) {
            botReply = "Claro, en la sección de 'Mujer' encontrarás vestidos, faldas, blusas, pantalones y mucho más.";
        } else if (userMessage.includes("hombre")) {
            botReply = "En la sección de 'Hombre' puedes ver camisas, camisetas, jeans, abrigos, etc.";
        }

        addBotMessage(botReply);

        // --- CÓDIGO REAL PARA INTEGRAR CON UN BACKEND DE CHATBOT (ej. Rasa) ---
        /*
        fetch('TU_URL_DEL_BACKEND_CHATBOT/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sender: 'user', message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                data.forEach(msg => {
                    addBotMessage(msg.text);
                });
            } else {
                addBotMessage("Lo siento, no pude obtener una respuesta en este momento. Por favor, inténtalo de nuevo más tarde.");
            }
        })
        .catch(error => {
            console.error('Error al conectar con el chatbot backend:', error);
            addBotMessage("Hubo un problema al conectar con el asistente. Por favor, inténtalo de nuevo.");
        });
        */
    }
});