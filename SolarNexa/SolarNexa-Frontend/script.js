/* =========================================================
   SOLARNEXA - COMMUNITY SOLAR ENERGY MANAGEMENT SYSTEM
   Frontend JavaScript
   Backend: Spring Boot + MySQL
========================================================= */

const API_BASE_URL = "http://localhost:8080/api";

let energyChart = null;
let generationConsumptionChart = null;
let energyDistributionChart = null;


/* =========================================================
   PAGE START
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setCurrentDate();
    setAllocationDate();
    setDefaultDates();
    setupNavigation();

    loadDashboard();

});


/* =========================================================
   COMMON HELPERS
========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function setText(id, value) {

    const element = getElement(id);

    if (element) {
        element.textContent = value;
    }

}


function formatNumber(value) {

    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });

}


function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function getToday() {

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function setDefaultDates() {

    const today = getToday();

    const generationDate = getElement("generation-date");
    const consumptionDate = getElement("consumption-date");
    const allocationDate = getElement("allocation-date");

    if (generationDate) {
        generationDate.value = today;
    }

    if (consumptionDate) {
        consumptionDate.value = today;
    }

    if (allocationDate) {
        allocationDate.value = today;
    }

}


/* =========================================================
   CURRENT DATE
========================================================= */

function setCurrentDate() {

    const dateElement = getElement("current-date");

    if (!dateElement) {
        return;
    }

    const today = new Date();

    dateElement.textContent =
        today.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {

        item.addEventListener("click", function (event) {

            event.preventDefault();

            navItems.forEach(function (nav) {
                nav.classList.remove("active");
            });

            item.classList.add("active");

            const section =
                item.getAttribute("data-section");

            if (section) {
                showSection(section);
            }

        });

    });

}


function showSection(sectionName) {

    const sections =
        document.querySelectorAll(".page-section");

    sections.forEach(function (section) {

        section.classList.remove("active-section");

    });


    const selectedSection =
        getElement(sectionName + "-section");

    if (selectedSection) {

        selectedSection.classList.add(
            "active-section"
        );

    }


    const pageInformation = {

        dashboard: [
            "Dashboard",
            "Community solar energy overview"
        ],

        generation: [
            "Solar Generation",
            "Monitor and manage solar energy production"
        ],

        households: [
            "Households",
            "Manage community household allocations"
        ],

        allocation: [
            "Energy Allocation",
            "Distribute generated solar energy across households"
        ],

        consumption: [
            "Consumption",
            "Track household energy usage and grid export"
        ],

        analytics: [
            "Analytics",
            "Analyze SolarNexa energy performance"
        ],

        alerts: [
            "Alerts & Monitoring",
            "Monitor generation, allocation and consumption conditions"
        ]

    };


    const title = getElement("page-title");
    const subtitle = getElement("page-subtitle");

    if (pageInformation[sectionName]) {

        if (title) {
            title.textContent =
                pageInformation[sectionName][0];
        }

        if (subtitle) {
            subtitle.textContent =
                pageInformation[sectionName][1];
        }

    }


    /* Load required data */

    if (sectionName === "dashboard") {
        loadDashboard();
    }

    if (sectionName === "generation") {
        loadInstallations();
        loadGenerationRecords();
    }

    if (sectionName === "households") {
        loadHouseholdInstallations();
        loadHouseholds();
    }

    if (sectionName === "allocation") {
        loadAllocationInstallations();
        setAllocationDate();
    }

    if (sectionName === "consumption") {
        loadConsumptionHouseholds();
        loadConsumptionRecords();
    }

    if (sectionName === "analytics") {
        loadAnalytics();
    }

    if (sectionName === "alerts") {
        loadAlerts();
    }

}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        const response =
            await fetch(
                API_BASE_URL + "/dashboard/summary"
            );

        if (!response.ok) {
            throw new Error(
                "Dashboard API failed"
            );
        }

        const data =
            await response.json();

        updateDashboard(data);

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        showDashboardFallback();

    }

}


function showDashboardFallback() {

    setText("capacity-value", "0 kW");
    setText("generation-value", "0 kWh");
    setText("household-value", "0");
    setText("export-value", "0 kWh");

    setText("flow-generation", "0 kWh");
    setText("flow-consumption", "0 kWh");
    setText("flow-export", "0 kWh");
    setText("allocation-value", "0 kWh");
    setText("allocation-percentage", "0%");

    const progress =
        getElement("allocation-progress");

    if (progress) {
        progress.style.width = "0%";
    }

}


function updateDashboard(data) {

    const capacity =
        Number(data.totalCapacityKw || 0);

    const generation =
        Number(data.todayGeneration || 0);

    const households =
        Number(data.totalHouseholds || 0);

    const allocation =
        Number(data.totalAllocatedEnergy || 0);

    const consumption =
        Number(data.totalConsumption || 0);

    const exported =
        Number(data.totalExportedEnergy || 0);


    setText(
        "capacity-value",
        formatNumber(capacity) + " kW"
    );

    setText(
        "generation-value",
        formatNumber(generation) + " kWh"
    );

    setText(
        "household-value",
        formatNumber(households)
    );

    setText(
        "export-value",
        formatNumber(exported) + " kWh"
    );


    setText(
        "flow-generation",
        formatNumber(generation) + " kWh"
    );

    setText(
        "flow-consumption",
        formatNumber(consumption) + " kWh"
    );

    setText(
        "flow-export",
        formatNumber(exported) + " kWh"
    );

    setText(
        "allocation-value",
        formatNumber(allocation) + " kWh"
    );


    let percentage = 0;

    if (generation > 0) {

        percentage =
            (allocation / generation) * 100;

    }

    percentage =
        Math.min(
            Math.max(percentage, 0),
            100
        );


    const progress =
        getElement("allocation-progress");

    if (progress) {
        progress.style.width =
            percentage + "%";
    }


    setText(
        "allocation-percentage",
        percentage.toFixed(1) + "%"
    );


    createEnergyChart(
        generation,
        allocation,
        consumption,
        exported
    );

}


/* =========================================================
   DASHBOARD ENERGY CHART
========================================================= */

function createEnergyChart(
    generation,
    allocation,
    consumption,
    exported
) {

    const canvas =
        getElement("energyChart");

    if (!canvas) {
        return;
    }

    if (typeof Chart === "undefined") {
        console.error(
            "Chart.js is not loaded."
        );
        return;
    }


    if (energyChart) {
        energyChart.destroy();
    }


    energyChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: [
                    "Generation",
                    "Allocated",
                    "Consumption",
                    "Grid Export"
                ],

                datasets: [

                    {
                        label: "Energy (kWh)",

                        data: [
                            generation,
                            allocation,
                            consumption,
                            exported
                        ],

                        backgroundColor: [
                            "rgba(255, 189, 69, 0.88)",
                            "rgba(168, 117, 255, 0.82)",
                            "rgba(39, 183, 242, 0.86)",
                            "rgba(44, 224, 139, 0.84)"
                        ],

                        borderColor: [
                            "#ffbd45",
                            "#a875ff",
                            "#27b7f2",
                            "#2ce08b"
                        ],

                        borderWidth: 1,

                        borderRadius: 10

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: {
                    duration: 900
                },

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return (
                                    " " +
                                    formatNumber(
                                        context.raw
                                    ) +
                                    " kWh"
                                );
                            }
                        }
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            color: "#8ca5b8"
                        },

                        grid: {
                            color:
                                "rgba(94,157,195,0.10)"
                        }

                    },

                    x: {

                        ticks: {
                            color: "#8ca5b8"
                        },

                        grid: {
                            display: false
                        }

                    }

                }

            }

        });

}


/* =========================================================
   INSTALLATIONS
========================================================= */

async function getInstallations() {

    const response =
        await fetch(
            API_BASE_URL + "/installations"
        );

    if (!response.ok) {

        throw new Error(
            "Unable to load installations."
        );

    }

    return await response.json();

}


async function loadInstallations() {

    const select =
        getElement("generation-installation");

    if (!select) {
        return;
    }


    try {

        const installations =
            await getInstallations();

        select.innerHTML =
            `<option value="">Select installation</option>`;


        installations.forEach(function (installation) {

            const option =
                document.createElement("option");

            option.value =
                installation.id;

            option.textContent =
                installation.name +
                " - " +
                installation.location;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Installation loading error:",
            error
        );

        select.innerHTML =
            `<option value="">Unable to load installations</option>`;

    }

}


/* =========================================================
   GENERATION FORM
========================================================= */

function openGenerationForm() {

    const form =
        getElement("generation-form");

    if (!form) {
        return;
    }

    form.classList.remove("hidden");

    const dateInput =
        getElement("generation-date");

    if (dateInput) {
        dateInput.value = getToday();
    }

    loadInstallations();

}


function closeGenerationForm() {

    const form =
        getElement("generation-form");

    if (form) {
        form.classList.add("hidden");
    }

}


/* =========================================================
   SAVE GENERATION
========================================================= */

async function saveGeneration() {

    const date =
        getElement("generation-date")?.value;

    const installationId =
        getElement("generation-installation")?.value;

    const units =
        getElement("generation-units")?.value;


    if (!date ||
        !installationId ||
        units === "") {

        alert(
            "Please fill all generation fields."
        );

        return;
    }


    if (Number(units) < 0) {

        alert(
            "Energy generated cannot be negative."
        );

        return;
    }


    const generationData = {

        generationDate: date,

        unitsGenerated:
            Number(units),

        installation: {
            id: Number(installationId)
        }

    };


    try {

        const response =
            await fetch(
                API_BASE_URL + "/generation",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            generationData
                        )

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Unable to save generation."
            );

        }


        alert(
            "Generation record saved successfully."
        );


        const unitsInput =
            getElement("generation-units");

        if (unitsInput) {
            unitsInput.value = "";
        }


        closeGenerationForm();

        await loadGenerationRecords();
        await loadDashboard();

    } catch (error) {

        console.error(
            "Save generation error:",
            error
        );

        alert(
            "Unable to save generation record.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   GENERATION RECORDS
========================================================= */

async function loadGenerationRecords() {

    const tableBody =
        getElement("generation-table-body");

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="loading-row">
                Loading generation records...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                API_BASE_URL + "/generation"
            );

        if (!response.ok) {

            throw new Error(
                "Generation API failed."
            );

        }


        const records =
            await response.json();


        if (!records || records.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="loading-row">
                        No generation records found.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML = "";


        records.forEach(function (record) {

            const row =
                document.createElement("tr");


            const installationName =
                record.installation
                    ? record.installation.name
                    : "Unknown";


            row.innerHTML = `

                <td>
                    #${record.id}
                </td>

                <td>
                    ${escapeHtml(
                        record.generationDate
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        installationName
                    )}
                </td>

                <td>

                    <span class="energy-badge">

                        ${formatNumber(
                            record.unitsGenerated
                        )} kWh

                    </span>

                </td>

                <td>

                    <button
                        class="delete-button"
                        onclick="deleteGeneration(${record.id})">

                        Delete

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Generation loading error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="loading-row">
                    Unable to load generation records.
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   DELETE GENERATION
========================================================= */

async function deleteGeneration(id) {

    if (!confirm(
        "Are you sure you want to delete this generation record?"
    )) {
        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/generation/" +
                id,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete operation failed."
            );

        }


        alert(
            "Generation record deleted successfully."
        );


        await loadGenerationRecords();
        await loadDashboard();

    } catch (error) {

        console.error(
            "Delete generation error:",
            error
        );

        alert(
            "Unable to delete generation record."
        );

    }

}


/* =========================================================
   HOUSEHOLDS
========================================================= */

async function loadHouseholds() {

    const tableBody =
        getElement("household-table-body");

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="5">
                Loading households...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                API_BASE_URL + "/households"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load households."
            );

        }


        const households =
            await response.json();


        if (!households || households.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="household-empty">
                        No households registered yet.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML = "";


        households.forEach(function (household) {

            const installationName =
                household.installation &&
                household.installation.name
                    ? household.installation.name
                    : "Installation #" +
                      (
                          household.installation?.id ||
                          "-"
                      );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${household.id}
                </td>

                <td class="household-name-cell">

                    ${escapeHtml(
                        household.householdName
                    )}

                </td>

                <td>

                    <span class="household-ratio-badge">

                        ${formatNumber(
                            household.allocationRatio
                        )}%

                    </span>

                </td>

                <td>

                    <span class="household-installation-badge">

                        ${escapeHtml(
                            installationName
                        )}

                    </span>

                </td>

                <td>

                    <button
                        class="delete-household-button"
                        onclick="deleteHousehold(${household.id})">

                        Delete

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Household loading error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="household-empty">
                    Unable to load households.
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   HOUSEHOLD FORM
========================================================= */

async function openHouseholdForm() {

    const panel =
        getElement("household-form-panel");

    if (!panel) {
        return;
    }

    panel.classList.remove("hidden");


    const name =
        getElement("household-name");

    const ratio =
        getElement("household-ratio");


    if (name) {
        name.value = "";
    }

    if (ratio) {
        ratio.value = "";
    }


    await loadHouseholdInstallations();

}


function closeHouseholdForm() {

    const panel =
        getElement("household-form-panel");

    if (panel) {
        panel.classList.add("hidden");
    }

}


async function loadHouseholdInstallations() {

    const select =
        getElement("household-installation");

    if (!select) {
        return;
    }


    try {

        const installations =
            await getInstallations();


        select.innerHTML = `
            <option value="">
                Select Installation
            </option>
        `;


        installations.forEach(function (installation) {

            const option =
                document.createElement("option");

            option.value =
                installation.id;

            option.textContent =
                installation.name +
                " — " +
                installation.capacityKw +
                " kW";

            select.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Household installation error:",
            error
        );

        select.innerHTML = `
            <option value="">
                Unable to load installations
            </option>
        `;

    }

}


/* =========================================================
   SAVE HOUSEHOLD
========================================================= */

async function saveHousehold() {

    const name =
        getElement("household-name")?.value.trim();

    const installationId =
        getElement("household-installation")?.value;

    const ratio =
        Number(
            getElement("household-ratio")?.value
        );


    if (!name) {

        alert(
            "Please enter the household name."
        );

        return;
    }


    if (!installationId) {

        alert(
            "Please select a solar installation."
        );

        return;
    }


    if (
        isNaN(ratio) ||
        ratio < 0 ||
        ratio > 100
    ) {

        alert(
            "Allocation ratio must be between 0% and 100%."
        );

        return;
    }


    try {

        const householdResponse =
            await fetch(
                API_BASE_URL + "/households"
            );


        if (!householdResponse.ok) {

            throw new Error(
                "Unable to check existing allocation."
            );

        }


        const households =
            await householdResponse.json();


        let existingAllocation = 0;


        households.forEach(function (household) {

            if (
                household.installation &&
                Number(
                    household.installation.id
                ) === Number(installationId)
            ) {

                existingAllocation +=
                    Number(
                        household.allocationRatio || 0
                    );

            }

        });


        if (
            existingAllocation + ratio > 100
        ) {

            alert(
                "Cannot save household.\n\n" +
                "Total allocation for this installation " +
                "would exceed 100%."
            );

            return;
        }


        const householdData = {

            householdName: name,

            allocationRatio: ratio,

            installation: {
                id: Number(installationId)
            }

        };


        const response =
            await fetch(
                API_BASE_URL + "/households",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            householdData
                        )

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Failed to save household."
            );

        }


        alert(
            "Household added successfully!"
        );


        closeHouseholdForm();

        await loadHouseholds();
        await loadDashboard();

    } catch (error) {

        console.error(
            "Save household error:",
            error
        );

        alert(
            "Unable to save household.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   DELETE HOUSEHOLD
========================================================= */

async function deleteHousehold(id) {

    if (!confirm(
        "Are you sure you want to delete this household?"
    )) {
        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/households/" +
                id,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Failed to delete household."
            );

        }


        alert(
            "Household deleted successfully!"
        );


        await loadHouseholds();
        await loadDashboard();

    } catch (error) {

        console.error(
            "Delete household error:",
            error
        );

        alert(
            "Unable to delete household.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   ENERGY ALLOCATION
========================================================= */

async function loadAllocationInstallations() {

    const select =
        getElement("allocation-installation");

    if (!select) {
        return;
    }


    try {

        const installations =
            await getInstallations();


        select.innerHTML = `
            <option value="">
                Select Installation
            </option>
        `;


        installations.forEach(function (installation) {

            const option =
                document.createElement("option");

            option.value =
                installation.id;

            option.textContent =
                installation.name +
                " — " +
                installation.capacityKw +
                " kW";

            select.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Allocation installation error:",
            error
        );

        select.innerHTML = `
            <option value="">
                Unable to load installations
            </option>
        `;

    }

}


/* =========================================================
   ALLOCATION DATE
========================================================= */

function setAllocationDate() {

    const dateInput =
        getElement("allocation-date");

    if (!dateInput) {
        return;
    }

    dateInput.value = getToday();

}


/* =========================================================
   CALCULATE ALLOCATION
========================================================= */

async function calculateAllocation() {

    const installationId =
        getElement("allocation-installation")?.value;

    const date =
        getElement("allocation-date")?.value;


    if (!installationId) {

        alert(
            "Please select a solar installation."
        );

        return;
    }


    if (!date) {

        alert(
            "Please select a generation date."
        );

        return;
    }


    const tableBody =
        getElement("allocation-table-body");

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="7">
                Calculating allocation...
            </td>
        </tr>
    `;


    try {

        const url =
            API_BASE_URL +
            "/allocation/installation/" +
            installationId +
            "?date=" +
            encodeURIComponent(date);


        const response =
            await fetch(url);


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Unable to calculate allocation."
            );

        }


        const results =
            await response.json();


        displayAllocationResults(results);


    } catch (error) {

        console.error(
            "Allocation error:",
            error
        );


        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="household-empty">
                    No allocation data found
                    for the selected installation and date.
                </td>
            </tr>
        `;


        const summary =
            getElement("allocation-summary");

        if (summary) {
            summary.classList.add("hidden");
        }


        alert(
            "Unable to calculate allocation.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   DISPLAY ALLOCATION
========================================================= */

function displayAllocationResults(results) {

    const tableBody =
        getElement("allocation-table-body");

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (!results || results.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="household-empty">
                    No household allocation records found.
                </td>
            </tr>
        `;

        return;
    }


    let totalGenerated = 0;
    let totalAllocated = 0;
    let totalConsumed = 0;
    let totalExported = 0;


    results.forEach(function (result) {

        const generated =
            Number(
                result.generatedEnergy || 0
            );

        const allocated =
            Number(
                result.allocatedEnergy || 0
            );

        const consumed =
            Number(
                result.consumedEnergy || 0
            );

        const remaining =
            Number(
                result.netUsage || 0
            );

        const exported =
            Number(
                result.exportedEnergy || 0
            );


        totalGenerated += generated;
        totalAllocated += allocated;
        totalConsumed += consumed;
        totalExported += exported;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td class="household-name-cell">

                ${escapeHtml(
                    result.householdName
                )}

            </td>

            <td>

                <span class="household-ratio-badge">

                    ${formatNumber(
                        result.allocationRatio
                    )}%

                </span>

            </td>

            <td>

                ${formatNumber(
                    generated
                )} kWh

            </td>

            <td>

                <strong>

                    ${formatNumber(
                        allocated
                    )} kWh

                </strong>

            </td>

            <td>

                ${formatNumber(
                    consumed
                )} kWh

            </td>

            <td class="remaining-energy">

                ${formatNumber(
                    remaining
                )} kWh

            </td>

            <td class="export-energy">

                ${formatNumber(
                    exported
                )} kWh

            </td>

        `;


        tableBody.appendChild(row);

    });


    setText(
        "allocation-generated",
        formatNumber(totalGenerated) +
        " kWh"
    );

    setText(
        "allocation-total",
        formatNumber(totalAllocated) +
        " kWh"
    );

    setText(
        "allocation-consumed",
        formatNumber(totalConsumed) +
        " kWh"
    );

    setText(
        "allocation-exported",
        formatNumber(totalExported) +
        " kWh"
    );


    const summary =
        getElement("allocation-summary");

    if (summary) {
        summary.classList.remove("hidden");
    }

}


/* =========================================================
   CONSUMPTION
========================================================= */

async function loadConsumptionHouseholds() {

    const select =
        getElement("consumption-household");

    if (!select) {
        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL + "/households"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load households."
            );

        }


        const households =
            await response.json();


        select.innerHTML = `
            <option value="">
                Select Household
            </option>
        `;


        households.forEach(function (household) {

            const option =
                document.createElement("option");

            option.value =
                household.id;

            option.textContent =
                household.householdName;

            select.appendChild(option);

        });


    } catch (error) {

        console.error(
            "Consumption household error:",
            error
        );

        select.innerHTML = `
            <option value="">
                Unable to load households
            </option>
        `;

    }

}


/* =========================================================
   CONSUMPTION FORM
========================================================= */

async function openConsumptionForm() {

    const panel =
        getElement("consumption-form-panel");

    if (!panel) {
        return;
    }

    panel.classList.remove("hidden");


    const dateInput =
        getElement("consumption-date");

    if (dateInput) {
        dateInput.value = getToday();
    }


    const consumed =
        getElement("units-consumed");

    const exported =
        getElement("units-exported");


    if (consumed) {
        consumed.value = "";
    }

    if (exported) {
        exported.value = "";
    }


    await loadConsumptionHouseholds();

}


function closeConsumptionForm() {

    const panel =
        getElement("consumption-form-panel");

    if (panel) {
        panel.classList.add("hidden");
    }

}


/* =========================================================
   SAVE CONSUMPTION
========================================================= */

async function saveConsumption() {

    const date =
        getElement("consumption-date")?.value;

    const householdId =
        getElement("consumption-household")?.value;

    const consumed =
        Number(
            getElement("units-consumed")?.value
        );

    const exported =
        Number(
            getElement("units-exported")?.value
        );


    if (!date) {

        alert(
            "Please select a consumption date."
        );

        return;
    }


    if (!householdId) {

        alert(
            "Please select a household."
        );

        return;
    }


    if (
        isNaN(consumed) ||
        consumed < 0
    ) {

        alert(
            "Consumed energy cannot be negative."
        );

        return;
    }


    if (
        isNaN(exported) ||
        exported < 0
    ) {

        alert(
            "Exported energy cannot be negative."
        );

        return;
    }


    const consumptionData = {

        consumptionDate: date,

        unitsConsumed: consumed,

        unitsExported: exported,

        household: {
            id: Number(householdId)
        }

    };


    try {

        const response =
            await fetch(
                API_BASE_URL + "/consumption",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            consumptionData
                        )

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Failed to save consumption."
            );

        }


        alert(
            "Consumption record added successfully!"
        );


        closeConsumptionForm();

        await loadConsumptionRecords();
        await loadDashboard();

    } catch (error) {

        console.error(
            "Save consumption error:",
            error
        );

        alert(
            "Unable to save consumption.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   CONSUMPTION RECORDS
========================================================= */

async function loadConsumptionRecords() {

    const tableBody =
        getElement("consumption-table-body");

    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = `
        <tr class="loading-row">
            <td colspan="6">
                Loading consumption records...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                API_BASE_URL + "/consumption"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load consumption records."
            );

        }


        const records =
            await response.json();


        if (!records || records.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="household-empty">
                        No consumption records available.
                    </td>
                </tr>
            `;

            return;
        }


        tableBody.innerHTML = "";


        records.forEach(function (record) {

            const row =
                document.createElement("tr");


            const householdName =
                record.household &&
                record.household.householdName
                    ? record.household.householdName
                    : "Household #" +
                      (
                          record.household?.id ||
                          "-"
                      );


            row.innerHTML = `

                <td>
                    ${record.id}
                </td>

                <td>
                    ${escapeHtml(
                        record.consumptionDate
                    )}
                </td>

                <td class="consumption-household">

                    ${escapeHtml(
                        householdName
                    )}

                </td>

                <td>

                    <span class="consumption-used-badge">

                        ${formatNumber(
                            record.unitsConsumed
                        )} kWh

                    </span>

                </td>

                <td>

                    <span class="consumption-export-badge">

                        ${formatNumber(
                            record.unitsExported
                        )} kWh

                    </span>

                </td>

                <td>

                    <button
                        class="delete-consumption-button"
                        onclick="deleteConsumption(${record.id})">

                        Delete

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(
            "Consumption loading error:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="household-empty">
                    Unable to load consumption records.
                </td>
            </tr>
        `;

    }

}


/* =========================================================
   DELETE CONSUMPTION
========================================================= */

async function deleteConsumption(id) {

    if (!confirm(
        "Are you sure you want to delete this consumption record?"
    )) {
        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/consumption/" +
                id,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Failed to delete record."
            );

        }


        alert(
            "Consumption record deleted successfully!"
        );


        await loadConsumptionRecords();
        await loadDashboard();

    } catch (error) {

        console.error(
            "Delete consumption error:",
            error
        );

        alert(
            "Unable to delete consumption record.\n\n" +
            error.message
        );

    }

}


/* =========================================================
   ANALYTICS
========================================================= */

async function loadAnalytics() {

    try {

        const [
            generationResponse,
            consumptionResponse,
            householdsResponse
        ] = await Promise.all([

            fetch(
                API_BASE_URL + "/generation"
            ),

            fetch(
                API_BASE_URL + "/consumption"
            ),

            fetch(
                API_BASE_URL + "/households"
            )

        ]);


        if (
            !generationResponse.ok ||
            !consumptionResponse.ok ||
            !householdsResponse.ok
        ) {

            throw new Error(
                "Unable to load analytics data."
            );

        }


        const generations =
            await generationResponse.json();

        const consumptions =
            await consumptionResponse.json();

        const households =
            await householdsResponse.json();


        calculateAnalytics(
            generations,
            consumptions,
            households
        );


    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );

    }

}


/* =========================================================
   CALCULATE ANALYTICS
========================================================= */

function calculateAnalytics(
    generations,
    consumptions,
    households
) {

    let totalGeneration = 0;
    let totalConsumption = 0;
    let totalExport = 0;
    let totalAllocation = 0;


    generations.forEach(function (record) {

        totalGeneration +=
            Number(
                record.unitsGenerated || 0
            );

    });


    consumptions.forEach(function (record) {

        totalConsumption +=
            Number(
                record.unitsConsumed || 0
            );

        totalExport +=
            Number(
                record.unitsExported || 0
            );

    });


    generations.forEach(function (generation) {

        const installationId =
            generation.installation &&
            generation.installation.id;


        if (!installationId) {
            return;
        }


        households.forEach(function (household) {

            if (
                household.installation &&
                Number(
                    household.installation.id
                ) === Number(installationId)
            ) {

                const ratio =
                    Number(
                        household.allocationRatio || 0
                    );


                totalAllocation +=
                    Number(
                        generation.unitsGenerated || 0
                    ) *
                    ratio /
                    100;

            }

        });

    });


    setText(
        "analytics-generation",
        formatNumber(totalGeneration) +
        " kWh"
    );

    setText(
        "analytics-consumption",
        formatNumber(totalConsumption) +
        " kWh"
    );

    setText(
        "analytics-export",
        formatNumber(totalExport) +
        " kWh"
    );

    setText(
        "analytics-allocation",
        formatNumber(totalAllocation) +
        " kWh"
    );


    let utilization = 0;
    let exportRatio = 0;
    let allocationEfficiency = 0;


    if (totalGeneration > 0) {

        utilization =
            (
                totalConsumption /
                totalGeneration
            ) * 100;

        exportRatio =
            (
                totalExport /
                totalGeneration
            ) * 100;

        allocationEfficiency =
            (
                totalAllocation /
                totalGeneration
            ) * 100;

    }


    utilization =
        Math.min(
            Math.max(utilization, 0),
            100
        );

    exportRatio =
        Math.min(
            Math.max(exportRatio, 0),
            100
        );

    allocationEfficiency =
        Math.min(
            Math.max(allocationEfficiency, 0),
            100
        );


    setText(
        "generation-utilization",
        formatNumber(utilization) + "%"
    );

    setText(
        "export-ratio",
        formatNumber(exportRatio) + "%"
    );

    setText(
        "allocation-efficiency",
        formatNumber(allocationEfficiency) + "%"
    );


    const utilizationBar =
        getElement(
            "generation-utilization-bar"
        );

    const exportBar =
        getElement(
            "export-ratio-bar"
        );

    const allocationBar =
        getElement(
            "allocation-efficiency-bar"
        );


    if (utilizationBar) {
        utilizationBar.style.width =
            utilization + "%";
    }

    if (exportBar) {
        exportBar.style.width =
            exportRatio + "%";
    }

    if (allocationBar) {
        allocationBar.style.width =
            allocationEfficiency + "%";
    }


    createGenerationConsumptionChart(
        totalGeneration,
        totalConsumption
    );


    const unused =
        Math.max(
            0,
            totalGeneration -
            totalConsumption -
            totalExport
        );


    createEnergyDistributionChart(
        totalConsumption,
        totalExport,
        unused
    );

}


/* =========================================================
   GENERATION VS CONSUMPTION CHART
========================================================= */

function createGenerationConsumptionChart(
    generation,
    consumption
) {

    const canvas =
        getElement(
            "generationConsumptionChart"
        );

    if (!canvas) {
        return;
    }

    if (typeof Chart === "undefined") {
        return;
    }


    if (generationConsumptionChart) {
        generationConsumptionChart.destroy();
    }


    generationConsumptionChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: [
                    "Solar Generation",
                    "Consumption"
                ],

                datasets: [

                    {
                        label: "Energy (kWh)",

                        data: [
                            generation,
                            consumption
                        ],

                        backgroundColor: [
                            "rgba(255,189,69,0.88)",
                            "rgba(39,183,242,0.88)"
                        ],

                        borderColor: [
                            "#ffbd45",
                            "#27b7f2"
                        ],

                        borderWidth: 1,

                        borderRadius: 10

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {
                            color: "#8ca5b8"
                        },

                        grid: {
                            color:
                                "rgba(94,157,195,0.10)"
                        }

                    },

                    x: {

                        ticks: {
                            color: "#8ca5b8"
                        },

                        grid: {
                            display: false
                        }

                    }

                }

            }

        });

}


/* =========================================================
   ENERGY DISTRIBUTION CHART
========================================================= */

function createEnergyDistributionChart(
    consumption,
    exported,
    unused
) {

    const canvas =
        getElement(
            "energyDistributionChart"
        );

    if (!canvas) {
        return;
    }

    if (typeof Chart === "undefined") {
        return;
    }


    if (energyDistributionChart) {
        energyDistributionChart.destroy();
    }


    energyDistributionChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: [
                    "Consumed",
                    "Grid Export",
                    "Unallocated"
                ],

                datasets: [

                    {
                        data: [
                            consumption,
                            exported,
                            unused
                        ],

                        backgroundColor: [
                            "#27b7f2",
                            "#2ce08b",
                            "#a875ff"
                        ],

                        borderColor: "#0b1d30",

                        borderWidth: 3

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "65%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {
                            color: "#8aa6ba",
                            usePointStyle: true,
                            padding: 18
                        }

                    }

                }

            }

        });

}


/* =========================================================
   ALERTS & MONITORING
========================================================= */

async function loadAlerts() {

    const list =
        getElement("alertsList");

    const criticalCount =
        getElement("criticalAlertCount");

    const warningCount =
        getElement("warningAlertCount");

    const normalCount =
        getElement("normalAlertCount");


    if (!list) {
        return;
    }


    list.innerHTML = `
        <div class="no-alerts">

            <div class="no-alert-icon">
                ...
            </div>

            <h3>
                Scanning SolarNexa
            </h3>

            <p>
                Checking generation, household allocation
                and consumption data.
            </p>

        </div>
    `;


    try {

        const [
            generationResponse,
            householdsResponse,
            consumptionResponse
        ] = await Promise.all([

            fetch(
                API_BASE_URL + "/generation"
            ),

            fetch(
                API_BASE_URL + "/households"
            ),

            fetch(
                API_BASE_URL + "/consumption"
            )

        ]);


        if (
            !generationResponse.ok ||
            !householdsResponse.ok ||
            !consumptionResponse.ok
        ) {

            throw new Error(
                "Unable to read monitoring data."
            );

        }


        const generations =
            await generationResponse.json();

        const households =
            await householdsResponse.json();

        const consumptions =
            await consumptionResponse.json();


        const today =
            getToday();


        const alerts = [];


        /* -----------------------------------------
           GENERATION CHECK
        ----------------------------------------- */

        if (
            !generations ||
            generations.length === 0
        ) {

            alerts.push({

                type: "critical",

                title:
                    "No generation records available",

                message:
                    "Solar generation data has not been recorded yet. " +
                    "Add a generation record to start monitoring production."

            });

        }


        /* -----------------------------------------
           ALLOCATION CHECK
        ----------------------------------------- */

        const installationTotals = {};


        households.forEach(function (household) {

            const installationId =
                household.installation &&
                household.installation.id;


            if (!installationId) {
                return;
            }


            installationTotals[installationId] =
                (
                    installationTotals[installationId] ||
                    0
                ) +
                Number(
                    household.allocationRatio || 0
                );

        });


        Object.keys(
            installationTotals
        ).forEach(function (id) {

            const total =
                installationTotals[id];


            if (total > 100) {

                alerts.push({

                    type: "critical",

                    title:
                        "Allocation exceeds 100%",

                    message:
                        "Installation #" +
                        id +
                        " has " +
                        formatNumber(total) +
                        "% household allocation. " +
                        "Review the registered household ratios."

                });

            } else if (total >= 80) {

                alerts.push({

                    type: "warning",

                    title:
                        "Allocation capacity is high",

                    message:
                        "Installation #" +
                        id +
                        " has " +
                        formatNumber(total) +
                        "% allocated to households. " +
                        "Remaining allocation capacity is limited."

                });

            }

        });


        /* -----------------------------------------
           TODAY GENERATION
        ----------------------------------------- */

        const todayGenerationByInstallation = {};


        generations.forEach(function (record) {

            if (
                record.generationDate !==
                today
            ) {
                return;
            }


            const installationId =
                record.installation &&
                record.installation.id;


            if (!installationId) {
                return;
            }


            todayGenerationByInstallation[
                installationId
            ] =
                (
                    todayGenerationByInstallation[
                        installationId
                    ] ||
                    0
                ) +
                Number(
                    record.unitsGenerated || 0
                );

        });


        /* -----------------------------------------
           HOUSEHOLD CONSUMPTION CHECK
        ----------------------------------------- */

        households.forEach(function (household) {

            const installationId =
                household.installation &&
                household.installation.id;


            if (!installationId) {
                return;
            }


            const generated =
                todayGenerationByInstallation[
                    installationId
                ] || 0;


            const ratio =
                Number(
                    household.allocationRatio || 0
                );


            const allocated =
                generated *
                ratio /
                100;


            const consumed =
                consumptions
                    .filter(function (record) {

                        return (
                            record.consumptionDate ===
                            today &&

                            record.household &&

                            Number(
                                record.household.id
                            ) ===
                            Number(
                                household.id
                            )
                        );

                    })
                    .reduce(function (
                        sum,
                        record
                    ) {

                        return (
                            sum +
                            Number(
                                record.unitsConsumed ||
                                0
                            )
                        );

                    }, 0);


            if (
                generated > 0 &&
                consumed > allocated
            ) {

                alerts.push({

                    type: "critical",

                    title:
                        "Consumption exceeds allocation",

                    message:
                        escapeHtml(
                            household.householdName ||
                            "Household"
                        ) +
                        " has used " +
                        formatNumber(
                            consumed
                        ) +
                        " kWh against " +
                        formatNumber(
                            allocated
                        ) +
                        " kWh allocated today."

                });

            }

        });


        /* -----------------------------------------
           NORMAL STATUS
        ----------------------------------------- */

        if (alerts.length === 0) {

            alerts.push({

                type: "normal",

                title:
                    "Solar network operating normally",

                message:
                    "No critical generation, allocation " +
                    "or consumption conditions were detected " +
                    "in the current data."

            });

        }


        /* -----------------------------------------
           COUNTERS
        ----------------------------------------- */

        const critical =
            alerts.filter(function (alert) {

                return alert.type === "critical";

            }).length;


        const warning =
            alerts.filter(function (alert) {

                return alert.type === "warning";

            }).length;


        const normal =
            alerts.filter(function (alert) {

                return alert.type === "normal";

            }).length;


        if (criticalCount) {
            criticalCount.textContent =
                critical;
        }

        if (warningCount) {
            warningCount.textContent =
                warning;
        }

        if (normalCount) {
            normalCount.textContent =
                normal;
        }


        /* -----------------------------------------
           DISPLAY ALERTS
        ----------------------------------------- */

        list.innerHTML =
            alerts.map(function (alert) {

                const icon =
                    alert.type === "normal"
                        ? "✓"
                        : "!";


                return `

                    <div
                        class="alert-card alert-${alert.type}">

                        <div
                            class="alert-status-icon">

                            ${icon}

                        </div>

                        <div>

                            <h3>
                                ${escapeHtml(
                                    alert.title
                                )}
                            </h3>

                            <p>
                                ${alert.message}
                            </p>

                        </div>

                    </div>

                `;

            }).join("");


    } catch (error) {

        console.error(
            "Alerts loading error:",
            error
        );


        if (criticalCount) {
            criticalCount.textContent = "—";
        }

        if (warningCount) {
            warningCount.textContent = "—";
        }

        if (normalCount) {
            normalCount.textContent = "—";
        }


        list.innerHTML = `

            <div class="no-alerts">

                <div class="no-alert-icon">
                    !
                </div>

                <h3>
                    Monitoring unavailable
                </h3>

                <p>
                    SolarNexa could not read the
                    backend monitoring data.
                    Make sure Spring Boot is running.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "SolarNexa JavaScript error:",
            event.error
        );

    }
);


/* =========================================================
   END OF SOLARNEXA SCRIPT
========================================================= */