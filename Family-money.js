const familyMembers = [
    { name: "Natasha 1", sex: "F" },
    { name: "Natasha 2", sex: "F" },
    { name: "Lordzeck 1", sex: "M" },
    { name: "Lordzeck 2", sex: "M" },
    { name: "Natasha 3", sex: "F" },
    { name: "Natasha 4", sex: "F" },
    { name: "Nankambo Ruth 1", sex: "F" },
    { name: "Nakate Rose 1", sex: "F" },
    { name: "Nakate Rose 2", sex: "F" },
    { name: "Nakate Gorret 1", sex: "M" },
 
];

function toggleTable() {
    const formContainer = document.getElementById("formContainer");
    const resultContainer = document.getElementById("resultContainer");
    const distributeBtn = document.getElementById("distributeBtn");

    if (formContainer.style.display === "none") {
        formContainer.style.display = "block";
        resultContainer.style.display = "none";
        distributeBtn.innerText = "Hide Table";
    } else {
        formContainer.style.display = "none";
        resultContainer.style.display = "block";
        distributeBtn.innerText = "Show Form";
    }
}

function showForm() {
    const formContainer = document.getElementById("formContainer");
    const familyForm = document.getElementById("familyForm");
    const tbody = familyForm.querySelector("tbody");
    const saveButton = familyForm.querySelector("button[type=submit]");
    formContainer.style.display = "block";
    saveButton.addEventListener("click", function(event) {
        event.preventDefault();
        saveData();
        formContainer.style.display = "none";
        displayResult();
        document.getElementById("resultContainer").style.display = "block";
    });

    tbody.innerHTML = "";

    let index = 1;
    let week = 1;
    for (const member of familyMembers) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${index}</td>
            <td>${member.name}</td>
            <td>${member.sex}</td>
            <td>${week}</td>
            <td><textarea name="paymentStatus_${member.name}" rows="1" cols="10"></textarea></td>
            <td><input type="number" name="amountReceived_${member.name}" min="0" required></td>
            <td><input type="date" name="date_${member.name}" required></td>
        `;
        tbody.appendChild(newRow);
        index++;
        week++;
    }
}

function saveData() {
    const familyForm = document.getElementById("familyForm");
    const formData = new FormData(familyForm);
    const entries = formData.entries();
    const collectedMoney = [];

    for (const entry of entries) {
        const [name, value] = entry;
        const [type, memberName] = name.split("_");
        const familyMember = parseInt(memberName.slice(-1));
        const existingData = collectedMoney.find(data => data.familyMember === familyMember);

        if (type === "paymentStatus" && existingData) {
            existingData.paymentStatus = value;
        } else if (type === "amountReceived" && existingData) {
            existingData.amountReceived = parseInt(value);
        } else if (type === "date" && existingData) {
            existingData.date = value;
        } else {
            collectedMoney.push({
                familyMember: familyMember,
                name: familyMembers[familyMember - 1].name,
                sex: familyMembers[familyMember - 1].sex,
                paymentStatus: type === "paymentStatus" ? value : "",
                amountReceived: type === "amountReceived" ? parseInt(value) : 0,
                date: type === "date" ? value : ""
            });
        }
    }

    localStorage.setItem("collectedMoney", JSON.stringify(collectedMoney));
}

function displayResult() {
    const resultTableBody = document.querySelector("#resultTable tbody");
    resultTableBody.innerHTML = "";

    const storedData = JSON.parse(localStorage.getItem("collectedMoney"));

    if (storedData) {
        let index = 1;
        for (const data of storedData) {
            const resultRow = `<tr>
                <td>${index}</td>
                <td>${data.familyMember}</td>
                <td>${data.name}</td>
                <td>${data.sex}</td>
                <td>${data.week}</td>
                <td><textarea id="paymentStatus_${data.name}" rows="1" cols="10">${data.paymentStatus}</textarea></td>
                <td><textarea id="amountReceived_${data.name}" rows="1" cols="10">${data.amountReceived}</textarea></td>


                <td><input type="date" id="date_${data.name}" value="${data.date}"></td>
            </tr>`;
            resultTableBody.innerHTML += resultRow;
            index++;
        }
    }
}

// Call the showForm function to display the form with family member data
showForm();

// Load saved form data and update the UI after the page loads
window.addEventListener("load", function() {
    const savedData = JSON.parse(localStorage.getItem("collectedMoney"));
    if (savedData) {
        for (const data of savedData) {
            familyMembers[data.familyMember - 1].week = data.week;
        }
    }
    loadFormData();
});

// Save the form data to localStorage whenever the form is submitted
const familyForm = document.getElementById("familyForm");
familyForm.addEventListener("submit", function(event) {
    event.preventDefault();
    saveData();
    loadFormData(); // Update the UI with the latest data
    document.getElementById("resultContainer").style.display = "block";
    
});
function downloadAsImage() {
    const container = document.querySelector(".container");
    const downloadBtn = document.getElementById("downloadBtn");

    // Hide the "Download" button temporarily to prevent it from appearing on the image
    downloadBtn.style.display = "none";

    html2canvas(container, {
        backgroundColor: "#f0f0f0", // Set the background color to match your container background color
        scrollX: 0,
        scrollY: 0
    }).then(canvas => {
        // Convert the canvas to an image data URL
        const imgData = canvas.toDataURL();

        // Create a temporary anchor element to trigger the download
        const downloadLink = document.createElement("a");
        downloadLink.href = imgData;
        downloadLink.download = "family_money_distribution.png";
        downloadLink.click();

        // Show the "Download" button again after the download is complete
        downloadBtn.style.display = "block";
    });
}

function formatAmount(input) {
    const cleanedInput = input.value.replace(/,/g, ""); // Remove existing commas
    const numericValue = parseFloat(cleanedInput); // Convert to a number

    if (!isNaN(numericValue)) {
        input.value = numberWithCommas(numericValue);
    } else {
        input.value = "";
    }
}
