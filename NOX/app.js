const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

document.getElementById("send").addEventListener("click", async () => {
    const recipient = document.getElementById("recipient").value;
    const fcfaAmount = parseFloat(document.getElementById("amount").value);

    if (!signer) {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
    }

    const contractAddress = "ADRESSE_DE_VOTRE_CONTRAT"; // Adresse du contrat NOX
    const abi = [
        "function transfer(address to, uint amount) public returns (bool)"
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const noxAmount = fcfaAmount / 5; // Conversion FCFA vers NOX

    if (noxAmount > 30000) {
        document.getElementById("status").innerText = "Erreur : Limite de transaction dépassée (150 000 FCFA maximum).";
        return;
    }

    try {
        const tx = await contract.transfer(recipient, ethers.utils.parseUnits(noxAmount.toString(), 18));
        document.getElementById("status").innerText = `Transaction envoyée : ${tx.hash}`;
    } catch (error) {
        document.getElementById("status").innerText = `Erreur : ${error.message}`;
    }
});

// Chatbot
const chatResponses = {
    "valeur nox": "1 NOX vaut 5 FCFA.",
    "limite transaction": "La limite est de 150 000 FCFA (30 000 NOX) par transaction.",
    "total supply": "L'offre totale de NOX est de 1 000 000.",
    "distribution initiale": "500 000 NOX ont été distribués au lancement.",
};

document.getElementById("ask").addEventListener("click", () => {
    const userInput = document.getElementById("user-input").value.toLowerCase();
    const chatBox = document.getElementById("chat-box");

    const userMessage = document.createElement("p");
    userMessage.innerHTML = `<b>Vous :</b> ${userInput}`;
    chatBox.appendChild(userMessage);

    const botMessage = document.createElement("p");
    botMessage.innerHTML = `<b>Bot :</b> ${chatResponses[userInput] || "Je ne comprends pas votre question. Essayez 'valeur NOX' ou 'limite transaction'."}`;
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight; // Scroll en bas
    document.getElementById("user-input").value = "";
});
