import type { Container } from "pixi.js";

export default function scaleFull(target: Container, width: number, height: number) {
	if (!target) return;
	if (target.width / target.height <= width / height) {
		target.width = width;
		const ratio = width / height;
		target.height = ratio * height;
	} else {
		target.height = height;
		const ratio = height / width;
		target.width = ratio * width;
	}
}
