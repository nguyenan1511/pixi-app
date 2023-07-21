import type { DisplayObject } from "pixi.js";

export default function moveToBottom(item: DisplayObject) {
	// console.log("moveToTop")
	const { parent } = item;
	const bottomZIndex = 0;
	for (let i = 0; i < parent?.children?.length; i += 1) {
		if (parent?.children) (parent as any).children[i].zIndex = i + 1; // re-assign zIndex to children
	}
	// swap zIndex of the top item
	// if(parent?.children) parent.children[bottomZIndex].zIndex = item.zIndex;
	item.zIndex = bottomZIndex;
	// sort children..
	if (parent?.children)
		parent.children.sort(function (a, b) {
			a.zIndex = a.zIndex || 0;
			b.zIndex = b.zIndex || 0;
			return a.zIndex - b.zIndex;
		});
}
