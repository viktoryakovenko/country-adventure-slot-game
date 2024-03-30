import {BoneData, Slot, SlotData, Spine} from "@pixi-spine/runtime-4.0";
import {Container} from "@pixi/display";
import SpineControl from "app/controls/SpineControl";

// noinspection JSUnusedGlobalSymbols
export default class SpineHelper {
    public static clearSlotContainers(spineControl: SpineControl, ...names: string[]) {
        const spine = spineControl.spine;
        if (!names || names.length == 0) {
            spine.slotContainers.forEach(slotContainer => slotContainer.removeChildren());
        } else {
            names.forEach(name => {
                const slotIndex = spine.spineData.slots.findIndex(slot => slot.name == name);
                spine.slotContainers[slotIndex].removeChildren();
            });
        }
    }

    static replaceInSlotContainer(
        spineControl: SpineControl, name: string, container: Container, copySlotsData = false
    ): Container | null {
        container.rotation = Math.PI;
        container.skew.y = Math.PI;
        const spine = spineControl.spine;
        const slots: SlotData[] = spine.spineData.slots;
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].name == name) {
                const slotContainer = spine.slotContainers[i];
                const displayObjects = slotContainer.removeChildren();
                if (copySlotsData) {
                    container.x = displayObjects[0].x;
                    container.y = displayObjects[0].y;
                    // todo: need to check for items that added in already replaced spine;
                    // container.rotation = displayObjects[0].rotation + Math.PI;
                    // container.skew.y = displayObjects[0].skew.y + Math.PI;
                }
                slotContainer.addChild(container);
                slotContainer.name = name;
                return slotContainer;
            }
        }
        return null;
    }

    public static addToSlotContainer(spineControl: SpineControl, name: string, container: Container): Container | null {
        container.rotation = Math.PI;
        container.skew.y = Math.PI;
        const spine = spineControl.spine;
        const slots: SlotData[] = spine.spineData.slots;
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].name == name) {
                const slotContainer = spine.slotContainers[i];
                slotContainer.addChild(container);
                return slotContainer;
            }
        }
        return null;
    }

    public static getSlotContainer(spineControl: SpineControl, name: string): Container | null {
        const spine = spineControl.spine;
        const slots: SlotData[] = spine.spineData.slots;
        const slot = slots.find(slot => slot.name == name);
        if (slot) {
            return spine.slotContainers[slot.index];
        }
        return null;
    }

    public static getSlot(spine: Spine, name: string): Slot | null {
        const slots: Slot[] = spine.skeleton.slots;
        for (let i = 0; i < slots.length; i++) {
            if (slots[i].data.name == name) {
                return slots[i];
            }
        }
        return null;
    }

    public static printSlots(spine: Spine): void {
        const slots: SlotData[] = spine.spineData.slots;
        let output = "Slots: ";
        for (let i = 0; i < slots.length; i++) {
            output += "[" + i + "] == " + slots[i].name;
            if (i < slots.length - 1) {
                output += ", ";
            }
        }
        console.log(output);
    }

    public static printBones(spine: Spine): void {
        const bones: BoneData[] = spine.spineData.bones;
        let output = "Bones: ";
        for (let i = 0; i < bones.length; i++) {
            const bone: BoneData = bones[i];
            output += "[" + i + "] == " + bone.name;
            if (i < bones.length - 1) {
                output += ", ";
            }
        }
        console.log(output);
    }
}
