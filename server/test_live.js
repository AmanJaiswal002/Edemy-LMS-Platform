async function testLiveWebhook() {
    const payload = JSON.stringify({
        "data": {
            "id": "live_user_test_456",
            "email_addresses": [
                {
                    "email_address": "livemock@gmail.com"
                }
            ],
            "first_name": "Live",
            "last_name": "Test",
            "image_url": "https://example.com/avatar.jpg"
        },
        "type": "user.created"
    });

    console.log("Sending Webhook Test to Vercel...");
    try {
        const response = await fetch('https://edemy-lms-backend-server.vercel.app/clerk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "svix-id": "msg_test",
                "svix-timestamp": Math.floor(Date.now() / 1000).toString(),
                "svix-signature": "v1,fake_signature_for_testing"
            },
            body: payload
        });
        
        try {
            const data = await response.json();
            console.log("Response from Vercel:", response.status, data);
        } catch(e) {
            const text = await response.text();
            console.log("Non-JSON Response from Vercel:", response.status, text.substring(0, 100));
        }
    } catch (e) {
        console.error("Failed to connect:", e.message);
    }
}

testLiveWebhook();
