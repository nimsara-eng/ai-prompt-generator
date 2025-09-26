// Backend API endpoint (Vercel)
const API_URL = "https://ai-prompt-generator-git-main-nimsara-engs-projects.vercel.app/api/generate";

// Elements
const categoryEl = document.getElementById("category");
const detailEl = document.getElementById("detail");
const descriptionEl = document.getElementById("description");
const styleEl = document.getElementById("style");
const reqEl = document.getElementById("requirements");
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
	// Use form-encoded to avoid CORS preflight from localhost
	const form = new URLSearchParams();
	Object.entries(payload).forEach(([key, value]) => {
		if (value !== undefined && value !== null) form.append(key, String(value));
	});

	const res = await fetch(API_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
		body: form.toString(),
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

function buildCombinedDescription() {
	const base = descriptionEl.value.trim();
	const style = styleEl.value.trim();
	const req = reqEl.value.trim();
	let combined = base;
	if (style) combined += (combined ? "\n\n" : "") + `Style: ${style}`;
	if (req) combined += (combined ? "\n\n" : "") + `Additional Requirements: ${req}`;
	return combined;
}

async function handleGenerate() {
	clearError();
	const category = categoryEl.value;
	const detail = detailEl.value;
	const combinedDesc = buildCombinedDescription();
	if (!combinedDesc) {
		showError("Please enter a description, or use Random Prompt.");
		return;
	}
	setLoading(true);
	try {
		// Map to original backend contract: use `keyword` instead of `description`
		const promptText = await callApi({ category, keyword: combinedDesc, detail });
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
		// For random flow, send a flag and rely on server-side defaulting
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
