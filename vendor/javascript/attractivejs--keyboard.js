// attractivejs/keyboard@1.0.0 downloaded from https://unpkg.com/attractivejs@1.0.0-alpha.8/dist/keyboard.js

//#region src/addons/keyboard/normalize.js
const macosSymbolLayerKeys = {
	"¡": "1",
	"™": "2",
	"£": "3",
	"¢": "4",
	"∞": "5",
	"§": "6",
	"¶": "7",
	"•": "8",
	"ª": "9",
	"º": "0",
	"–": "-",
	"≠": "=",
	"⁄": "!",
	"€": "@",
	"‹": "#",
	"›": "$",
	"ﬁ": "%",
	"ﬂ": "^",
	"‡": "&",
	"°": "*",
	"·": "(",
	"‚": ")",
	"—": "_",
	"±": "+",
	"œ": "q",
	"∑": "w",
	"®": "r",
	"†": "t",
	"¥": "y",
	"ø": "o",
	"π": "p",
	"“": "[",
	"‘": "]",
	"«": "\\",
	"Œ": "Q",
	"„": "W",
	"´": "E",
	"‰": "R",
	"ˇ": "T",
	"Á": "Y",
	"¨": "U",
	"ˆ": "I",
	"Ø": "O",
	"∏": "P",
	"”": "{",
	"’": "}",
	"»": "|",
	"å": "a",
	"ß": "s",
	"∂": "d",
	"ƒ": "f",
	"©": "g",
	"˙": "h",
	"∆": "j",
	"˚": "k",
	"¬": "l",
	"…": ";",
	"æ": "'",
	"Å": "A",
	"Í": "S",
	"Î": "D",
	"Ï": "F",
	"˝": "G",
	"Ó": "H",
	"Ô": "J",
	"": "K",
	"Ò": "L",
	"Ú": ":",
	"Æ": "\"",
	"Ω": "z",
	"≈": "x",
	"ç": "c",
	"√": "v",
	"∫": "b",
	"µ": "m",
	"≤": ",",
	"≥": ".",
	"÷": "/",
	"¸": "Z",
	"˛": "X",
	"Ç": "C",
	"◊": "V",
	"ı": "B",
	"˜": "N",
	"Â": "M",
	"¯": "<",
	"˘": ">",
	"¿": "?"
};
const macosUppercaseLayerKeys = {
	"`": "~",
	1: "!",
	2: "@",
	3: "#",
	4: "$",
	5: "%",
	6: "^",
	7: "&",
	8: "*",
	9: "(",
	0: ")",
	"-": "_",
	"=": "+",
	"[": "{",
	"]": "}",
	"\\": "|",
	";": ":",
	"'": "\"",
	",": "<",
	".": ">",
	"/": "?",
	q: "Q",
	w: "W",
	e: "E",
	r: "R",
	t: "T",
	y: "Y",
	u: "U",
	i: "I",
	o: "O",
	p: "P",
	a: "A",
	s: "S",
	d: "D",
	f: "F",
	g: "G",
	h: "H",
	j: "J",
	k: "K",
	l: "L",
	z: "Z",
	x: "X",
	c: "C",
	v: "V",
	b: "B",
	n: "N",
	m: "M"
};
const syntheticKeyNames = {
	" ": "Space",
	"+": "Plus"
};
const modifierKeyNames = [
	"Control",
	"Alt",
	"Meta",
	"Shift"
];
const orderedModifiers = {
	Control: 0,
	Alt: 1,
	Meta: 2,
	Shift: 3
};
const matchApplePlatform = /Mac|iPod|iPhone|iPad/i;
var Normalize = class Normalize {
	static match(event, { with: keyString, on: platform }) {
		const attributeString = Normalize.normalize(keyString, platform).toLowerCase();
		const eventString = Normalize.#serialize(event, platform).toLowerCase();
		if (attributeString === eventString) return true;
		if (eventString.includes("shift+") && !attributeString.includes("shift+")) {
			if (attributeString === eventString.replace(/shift\+/g, "")) return true;
		}
		return false;
	}
	static normalize(keyString, platform) {
		let normalized = Normalize.#localizeModifier(keyString, platform);
		normalized = Normalize.#sortModifiers(normalized);
		return normalized;
	}
	static sequence(sequence, platform) {
		return sequence.split(" ").map((part) => Normalize.normalize(part, platform)).join(" ");
	}
	static #serialize(event, platform) {
		const { ctrlKey, altKey, metaKey, shiftKey, key } = event;
		const keyNames = [];
		const modifierFlags = [
			ctrlKey,
			altKey,
			metaKey,
			shiftKey
		];
		for (const [index, flag] of modifierFlags.entries()) if (flag) keyNames.push(modifierKeyNames[index]);
		if (!modifierKeyNames.includes(key)) {
			const platformName = platform ?? navigator?.userAgent ?? "";
			const isApplePlatform = matchApplePlatform.test(platformName);
			const altNormalizedKey = keyNames.includes("Alt") && isApplePlatform ? macosSymbolLayerKeys[key] ?? key : key;
			const shiftNormalizedKey = keyNames.includes("Shift") && isApplePlatform ? macosUppercaseLayerKeys[altNormalizedKey] ?? altNormalizedKey : altNormalizedKey;
			const syntheticKey = syntheticKeyNames[shiftNormalizedKey] ?? shiftNormalizedKey;
			keyNames.push(syntheticKey);
		}
		return keyNames.join("+");
	}
	static #localizeModifier(keyString, platform) {
		const platformName = platform ?? navigator?.userAgent ?? "";
		const localModifier = matchApplePlatform.test(platformName) ? "Meta" : "Control";
		return keyString.replace(/Mod/i, localModifier);
	}
	static #sortModifiers(keyString) {
		return keyString.split("+").sort((a, b) => (orderedModifiers[a] ?? Infinity) - (orderedModifiers[b] ?? Infinity)).join("+");
	}
};
//#endregion
//#region src/addons/keyboard/active_editable_element.js
function activeEditableElement() {
	return editableElement(document.activeElement);
}
function editableElement(element) {
	if (!element || !element.tagName) return false;
	const tag = element.tagName.toLowerCase();
	if (tag === "textarea" || tag === "select") return true;
	if (tag === "input") {
		const type = element.type?.toLowerCase();
		return !(type === "button" || type === "checkbox" || type === "file" || type === "hidden" || type === "image" || type === "radio" || type === "reset" || type === "submit");
	}
	return element.isContentEditable;
}
//#endregion
//#region src/debug.js
var Debug = class {
	static enabled = false;
	static prefix = "🧲 ";
	static log(...args) {
		if (this.enabled) console.log(this.prefix, ...args);
	}
	static warn(...args) {
		if (this.enabled) console.warn(this.prefix, ...args);
	}
	static error(...args) {
		if (this.enabled) console.error(this.prefix, ...args);
	}
};
//#endregion
//#region src/addons/keyboard/hotkey.js
const HOTKEY_PREFIX = "@hotkey.";
const KEY_NAME_TRANSLATIONS = {
	Space: " ",
	Plus: "+"
};
var Hotkey = class {
	#elements = /* @__PURE__ */ new Set();
	#sequenceState = /* @__PURE__ */ new Map();
	#modifierKeys = /* @__PURE__ */ new Set([
		"ctrl",
		"alt",
		"shift",
		"meta",
		"mod"
	]);
	#heldKeys = /* @__PURE__ */ new Set();
	#sequenceTimeout = 1500;
	#listening = false;
	setup(instance) {
		if (this.#listening) return;
		this.#listening = true;
		instance.onElementAdded((element) => {
			if (this.#hasHotkeyAttribute(element)) this.#elements.add(element);
		});
		instance.onElementRemoved((element) => {
			this.#elements.delete(element);
		});
		Array.from(document.querySelectorAll("*")).filter((element) => this.#hasHotkeyAttribute(element)).forEach((element) => this.#elements.add(element));
		document.addEventListener("keyup", (event) => {
			this.#heldKeys.delete(event.key);
		});
		instance.addEventListener("keydown", (event) => {
			this.#heldKeys.add(event.key);
			if (!activeEditableElement()) this.#process(event);
		});
	}
	clearSequenceState() {
		this.#sequenceState.forEach((step) => clearTimeout(step.timeout));
		this.#sequenceState.clear();
	}
	#hasHotkeyAttribute(element) {
		return Array.from(element.attributes).some((attribute) => attribute.name.startsWith(HOTKEY_PREFIX));
	}
	#process(event) {
		let activated = false;
		for (const element of this.#elements) if (this.#processElement({
			for: event,
			on: element
		})) activated = true;
		if (activated) {
			event.preventDefault();
			this.#heldKeys.clear();
		}
	}
	#processElement({ for: event, on: element }) {
		const hotkey = this.#hotkeyAttribute({ for: element });
		if (!hotkey) return false;
		const { modifiers, value } = hotkey;
		if (modifiers.some((part) => part.includes("+"))) {
			const keys = modifiers.flatMap((part) => part.split("+"));
			const modifierCodes = keys.filter((key) => this.#modifierKeys.has(key));
			const triggerCodes = keys.filter((key) => !modifierCodes.includes(key));
			if (this.#matches(event, {
				with: modifierCodes,
				and: triggerCodes
			})) {
				Debug.log("hotkey combo →", element);
				this.#activate({
					on: element,
					with: value
				});
				return true;
			}
			return false;
		}
		if (modifiers.length > 1) return this.#matchSequence({
			for: event,
			on: element,
			sequence: modifiers,
			with: value
		});
		if (this.#keyMatch(event, { with: modifiers[0] })) {
			this.#activate({
				on: element,
				with: value
			});
			return true;
		}
		return false;
	}
	#hotkeyAttribute({ for: element }) {
		const attribute = Array.from(element.attributes).find((attribute) => attribute.name.startsWith(HOTKEY_PREFIX));
		if (!attribute) return null;
		return {
			modifiers: attribute.name.slice(8).split("."),
			value: attribute.value
		};
	}
	#keyMatch(event, { with: keyString }) {
		return Normalize.match(event, { with: keyString });
	}
	#matchSequence({ for: event, on: element, sequence, with: value }) {
		const step = this.#sequenceState.get(element);
		const expectedKey = step ? sequence[step.position] : sequence[0];
		if (!this.#keyMatch(event, { with: expectedKey })) {
			this.#resetSequence({ on: element });
			return false;
		}
		if (!step) {
			this.#startSequence({
				on: element,
				sequence
			});
			return false;
		}
		if (this.#heldKeys.has(sequence[step.position - 1])) {
			this.#resetSequence({ on: element });
			return false;
		}
		return this.#advanceSequence({
			for: event,
			on: element,
			step,
			sequence,
			with: value
		});
	}
	#matches(event, { with: modifierCodes, and: triggerCodes }) {
		const platformModifierCodes = modifierCodes.map((code) => code === "mod" ? this.#platformModifierCode : code);
		if (platformModifierCodes.includes("ctrl") && !event.ctrlKey) return false;
		if (platformModifierCodes.includes("alt") && !event.altKey) return false;
		if (platformModifierCodes.includes("shift") && !event.shiftKey) return false;
		if (platformModifierCodes.includes("meta") && !event.metaKey) return false;
		if (triggerCodes.map((code) => KEY_NAME_TRANSLATIONS[code] ?? code).some((code) => !this.#heldKeys.has(code))) return false;
		return true;
	}
	get #platformModifierCode() {
		return /Mac|iPod|iPhone|iPad/i.test(navigator.userAgent) ? "meta" : "ctrl";
	}
	#activate({ on: element, with: value }) {
		const tag = element.tagName.toLowerCase();
		const id = element.id ? `#${element.id}` : "";
		if (editableElement(element)) {
			Debug.log(`hotkey → ${tag}${id} [focus]`);
			element.focus();
		} else if (value) {
			Debug.log(`hotkey → ${tag}${id} [${value}]`);
			element.dispatchEvent(new Event("hotkey", { bubbles: true }));
		} else {
			Debug.log(`hotkey → ${tag}${id} [click]`);
			element.click();
		}
	}
	#resetSequence({ on: element }) {
		const tag = element.tagName.toLowerCase();
		const id = element.id ? `#${element.id}` : "";
		Debug.log(`hotkey sequence reset → ${tag}${id}`);
		clearTimeout(this.#sequenceState.get(element)?.timeout);
		this.#sequenceState.delete(element);
	}
	#startSequence({ on: element, sequence }) {
		const tag = element.tagName.toLowerCase();
		const id = element.id ? `#${element.id}` : "";
		const keys = `${sequence[0]}→${sequence[1]}`;
		Debug.log(`hotkey sequence ${keys} → ${tag}${id}`);
		const timeout = setTimeout(() => this.#sequenceState.delete(element), this.#sequenceTimeout);
		this.#sequenceState.set(element, {
			position: 1,
			timeout
		});
	}
	#advanceSequence({ for: event, on: element, step, sequence, with: value }) {
		clearTimeout(step.timeout);
		step.position++;
		if (step.position >= sequence.length) {
			const tag = element.tagName.toLowerCase();
			const id = element.id ? `#${element.id}` : "";
			Debug.log(`hotkey sequence complete → ${tag}${id}`);
			this.#sequenceState.delete(element);
			this.#activate({
				on: element,
				with: value
			});
			return true;
		}
		const tag = element.tagName.toLowerCase();
		const id = element.id ? `#${element.id}` : "";
		Debug.log(`hotkey sequence ${sequence[step.position]} → ${tag}${id}`);
		step.timeout = setTimeout(() => this.#sequenceState.delete(element), this.#sequenceTimeout);
		return false;
	}
};
const hotkey = new Hotkey();
//#endregion
//#region src/addons/keyboard/index.js
const enter = (event) => event.type === "hotkey" || event.key === "Enter";
const escape = (event) => event.type === "hotkey" || event.key === "Escape";
const space = (event) => event.type === "hotkey" || event.key === " ";
const tab = (event) => event.type === "hotkey" || event.key === "Tab";
const arrowup = (event) => event.type === "hotkey" || event.key === "ArrowUp";
const arrowdown = (event) => event.type === "hotkey" || event.key === "ArrowDown";
const arrowleft = (event) => event.type === "hotkey" || event.key === "ArrowLeft";
const arrowright = (event) => event.type === "hotkey" || event.key === "ArrowRight";
const ctrl = (event) => event.type === "hotkey" || event.ctrlKey;
const alt = (event) => event.type === "hotkey" || event.altKey;
const shift = (event) => event.type === "hotkey" || event.shiftKey;
const meta = (event) => event.type === "hotkey" || event.metaKey;
function keyboard({ instance, registry }) {
	registry.addEventModifier("enter", enter);
	registry.addEventModifier("escape", escape);
	registry.addEventModifier("space", space);
	registry.addEventModifier("tab", tab);
	registry.addEventModifier("arrowup", arrowup);
	registry.addEventModifier("arrowdown", arrowdown);
	registry.addEventModifier("arrowleft", arrowleft);
	registry.addEventModifier("arrowright", arrowright);
	registry.addEventModifier("ctrl", ctrl);
	registry.addEventModifier("alt", alt);
	registry.addEventModifier("shift", shift);
	registry.addEventModifier("meta", meta);
	registry.addEventModifier("window", (event) => {
		if (event.type.startsWith("key") && activeEditableElement()) return false;
	});
	registry.addEventModifier("document", (event) => {
		if (event.type.startsWith("key") && activeEditableElement()) return false;
	});
	hotkey.setup(instance);
}
//#endregion
export { alt, arrowdown, arrowleft, arrowright, arrowup, ctrl, enter, escape, keyboard, meta, shift, space, tab };
