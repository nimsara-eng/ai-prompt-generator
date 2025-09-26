// Backend API endpoint (Vercel)
const API_URL = "https://ai-prompt-generator-gk965ksj5-nimsara-engs-projects.vercel.app/api/generate";

// Elements
const categoryEl = document.getElementById("category");
const detailEl = document.getElementById("detail");
const descriptionEl = document.getElementById("description");
const generateBtn = document.getElementById("generateBtn");
const randomBtn = document.getElementById("randomBtn");
const copyBtn = document.getElementById("copyBtn");
const outputEl = document.getElementById("output");
const errorMsgEl = document.getElementById("errorMsg");
const loaderEl = document.getElementById("loader");
const themeToggleBtn = document.getElementById("themeToggle");

// Dark mode persistence using localStorage
(function initTheme() {
	try {
		const saved = localStorage.getItem("apg_theme");
		if (saved === "dark") document.documentElement.classList.add("dark");
		if (saved === "light") document.documentElement.classList.remove("dark");
	} catch {}
})();

themeToggleBtn?.addEventListener("click", () => {
	const isDark = document.documentElement.classList.toggle("dark");
	try { localStorage.setItem("apg_theme", isDark ? "dark" : "light"); } catch {}
});

function setLoading(isLoading) {
	if (isLoading) {
		loaderEl.classList.remove("hidden");
		generateBtn.disabled = true;
		randomBtn.disabled = true;
		generateBtn.classList.add("opacity-80");
		randomBtn.classList.add("opacity-80");
	} else {
		loaderEl.classList.add("hidden");
		generateBtn.disabled = false;
		randomBtn.disabled = false;
		generateBtn.classList.remove("opacity-80");
		randomBtn.classList.remove("opacity-80");
	}
}

function showError(message) {
	errorMsgEl.textContent = message;
	errorMsgEl.classList.remove("hidden");
}

function clearError() {
	errorMsgEl.textContent = "";
	errorMsgEl.classList.add("hidden");
}

async function callApi(payload) {
	const res = await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(text || `Request failed with status ${res.status}`);
	}
	const data = await res.json();
	if (!data || typeof data.prompt !== "string") {
		throw new Error("Invalid response format from server.");
	}
	return data.prompt;
}

async function handleGenerate() {
	clearError();
	const category = categoryEl.value;
	const detail = detailEl.value;
	const description = descriptionEl.value.trim();
	if (!description) {
		showError("Please enter a description, or use Random Prompt.");
		return;
	}
	setLoading(true);
	try {
		const promptText = await callApi({ category, description, detail });
		outputEl.textContent = promptText;
	} catch (err) {
		showError(err?.message || "Something went wrong. Please try again.");
	} finally {
		setLoading(false);
	}
}

async function handleRandom() {
	clearError();
	const category = categoryEl.value;
	const detail = detailEl.value;
	setLoading(true);
	try {
		const promptText = await callApi({ category, random: true, detail });
		outputEl.textContent = promptText;
	} catch (err) {
		showError(err?.message || "Something went wrong. Please try again.");
	} finally {
		setLoading(false);
	}
}

generateBtn?.addEventListener("click", handleGenerate);
randomBtn?.addEventListener("click", handleRandom);

copyBtn?.addEventListener("click", async () => {
	const text = outputEl.textContent?.trim();
	if (!text) return;
	try {
		await navigator.clipboard.writeText(text);
		copyBtn.textContent = "Copied";
		setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
	} catch {
		showError("Failed to copy to clipboard.");
	}
}); 
