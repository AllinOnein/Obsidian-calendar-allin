import {MarkdownView, TAbstractFile, TFile, TFolder, WorkspaceLeaf} from "obsidian";
import {DateTime} from "luxon";
import {NoteType, SelectedItemType} from "../base/enum";
import SelectedItem from "../entity/SelectedItem";
import Path from "../util/Path";
import PathUtil from "../util/PathUtil";
import ConfirmCreatingNoteModal from "../view/modal/ConfirmCreatingNoteModal";
import DustCalendarPlugin from "../main";


/**
 * 封装笔记操作
 */
export default class NoteController {

    public readonly plugin: DustCalendarPlugin;
    private noteType: NoteType;

    constructor(plugin: DustCalendarPlugin) {
        this.plugin = plugin;
        this.noteType = NoteType.DAILY;
    }

    public getNoteOption(noteType: NoteType): boolean {

        if (noteType === NoteType.DAILY) {
            return this.plugin.database.setting.dailyNoteOption;
        }
        else if (noteType === NoteType.WEEKLY) {
            return this.plugin.database.setting.weeklyNoteOption;
        }
        else if (noteType === NoteType.MONTHLY) {
            return this.plugin.database.setting.monthlyNoteOption;
        }
        else if (noteType === NoteType.QUARTERLY) {
            return this.plugin.database.setting.quarterlyNoteOption;
        }
        else if (noteType === NoteType.YEARLY) {
            return this.plugin.database.setting.yearlyNoteOption;
        }

        return false;
    }

    public setNoteOption(noteType: NoteType, noteOption: boolean): void {
        if (noteType === NoteType.DAILY) {
            this.plugin.database.setting.dailyNoteOption = noteOption;
        }
        else if (noteType === NoteType.WEEKLY) {
            this.plugin.database.setting.weeklyNoteOption = noteOption;
        }
        else if (noteType === NoteType.MONTHLY) {
            this.plugin.database.setting.monthlyNoteOption = noteOption;
        }
        else if (noteType === NoteType.QUARTERLY) {
            this.plugin.database.setting.quarterlyNoteOption = noteOption;
        }
        else if (noteType === NoteType.YEARLY) {
            this.plugin.database.setting.yearlyNoteOption = noteOption;
        }
    }

    public getNotePattern(noteType: NoteType): string {

        let noteOption: boolean = false;
        let notePattern: string = "";
        const {setting} = this.plugin.database;

        if (noteType === NoteType.DAILY) {
            noteOption = setting.dailyNoteOption;
            notePattern = setting.dailyNotePattern;
        }
        else if (noteType === NoteType.WEEKLY) {
            noteOption = setting.weeklyNoteOption;
            notePattern = setting.weeklyNotePattern;
        }
        else if (noteType === NoteType.MONTHLY) {
            noteOption = setting.monthlyNoteOption;
            notePattern = setting.monthlyNotePattern;
        }
        else if (noteType === NoteType.QUARTERLY) {
            noteOption = setting.quarterlyNoteOption;
            notePattern = setting.quarterlyNotePattern;
        }
        else if (noteType === NoteType.YEARLY) {
            noteOption = setting.yearlyNoteOption;
            notePattern = setting.yearlyNotePattern;
        }

        if (!noteOption || notePattern.length === 0) {
            return "";
        }

        return notePattern;
    }

    public setNotePattern(noteType: NoteType, notePattern: string): void {
        if (noteType === NoteType.DAILY) {
            this.plugin.database.setting.dailyNotePattern = notePattern;
        }
        else if (noteType === NoteType.WEEKLY) {
            this.plugin.database.setting.weeklyNotePattern = notePattern;
        }
        else if (noteType === NoteType.MONTHLY) {
            this.plugin.database.setting.monthlyNotePattern = notePattern;
        }
        else if (noteType === NoteType.QUARTERLY) {
            this.plugin.database.setting.quarterlyNotePattern = notePattern;
        }
        else if (noteType === NoteType.YEARLY) {
            this.plugin.database.setting.yearlyNotePattern = notePattern;
        }
    }

    public getShouldConfirmBeforeCreatingNote(): boolean {
        return this.plugin.database.setting.shouldConfirmBeforeCreatingNote;
    }

    public setShouldConfirmBeforeCreatingNote(shouldConfirmBeforeCreatingNote: boolean): void {
        this.plugin.database.setting.shouldConfirmBeforeCreatingNote = shouldConfirmBeforeCreatingNote;
    }

    public getNoteSearchFolder(noteType: NoteType): string {
        const {setting} = this.plugin.database;
        if (noteType === NoteType.DAILY) {
            return setting.dailyNoteSearchFolder;
        }
        else if (noteType === NoteType.WEEKLY) {
            return setting.weeklyNoteSearchFolder;
        }
        else if (noteType === NoteType.MONTHLY) {
            return setting.monthlyNoteSearchFolder;
        }
        else if (noteType === NoteType.QUARTERLY) {
            return setting.quarterlyNoteSearchFolder;
        }
        else if (noteType === NoteType.YEARLY) {
            return setting.yearlyNoteSearchFolder;
        }
        return "";
    }

    public setNoteSearchFolder(noteType: NoteType, folder: string): void {
        const {setting} = this.plugin.database;
        if (noteType === NoteType.DAILY) {
            setting.dailyNoteSearchFolder = folder;
        }
        else if (noteType === NoteType.WEEKLY) {
            setting.weeklyNoteSearchFolder = folder;
        }
        else if (noteType === NoteType.MONTHLY) {
            setting.monthlyNoteSearchFolder = folder;
        }
        else if (noteType === NoteType.QUARTERLY) {
            setting.quarterlyNoteSearchFolder = folder;
        }
        else if (noteType === NoteType.YEARLY) {
            setting.yearlyNoteSearchFolder = folder;
        }
    }

    public getNotePatternPlaceHolder(noteType: NoteType): string {

        if (noteType === NoteType.DAILY) {
            return "日记/yyyy-MM-dd";
        }
        else if (noteType === NoteType.WEEKLY) {
            return "周记/yyyy-WW";
        }
        else if (noteType === NoteType.MONTHLY) {
            return "月度总结/yyyy-MM";
        }
        else if (noteType === NoteType.QUARTERLY) {
            return "季度总结/yyyy-qq";
        }
        else if (noteType === NoteType.YEARLY) {
            return "年度总结/yyyy";
        }

        return "";
    }

    public hasNote(date: DateTime, noteType: NoteType): boolean {
        const noteFilename = this.getExistingNoteFilename(date, noteType);
        if (noteFilename === null) {
            return false;
        }
        const abstractFile = this.plugin.app.vault.getAbstractFileByPath(noteFilename);
        return abstractFile instanceof TFile;
    }

    private getTargetDate(date: DateTime, noteType: NoteType): DateTime {
        if (noteType === NoteType.WEEKLY) {
            return date.set({weekday: 4});
        }
        return date;
    }

    private getNoteBasename(date: DateTime, noteType: NoteType): string | null {
        const notePattern: string | null = this.getNotePattern(noteType);
        if (notePattern.length === 0) {
            return null;
        }
        const index = notePattern.lastIndexOf("/");
        let basenamePattern = notePattern;
        if (index !== -1 && index + 1 < notePattern.length) {
            basenamePattern = notePattern.substring(index + 1);
        }
        const targetDate = this.getTargetDate(date, noteType);
        return targetDate.setLocale(navigator.language).toFormat(basenamePattern).concat(".md");
    }

    public getNoteFilename(date: DateTime, noteType: NoteType): string | null {
        const notePattern: string | null = this.getNotePattern(noteType);
        if (notePattern.length === 0) {
            return null;
        }
        const targetDate = this.getTargetDate(date, noteType);
        return targetDate.setLocale(navigator.language).toFormat(notePattern).concat(".md");
    }

    public getExistingNoteFilename(date: DateTime, noteType: NoteType): string | null {
        const searchFolder = this.getNoteSearchFolder(noteType);
        const targetDate = this.getTargetDate(date, noteType);
        if (searchFolder.length === 0) {
            return this.getNoteFilename(targetDate, noteType);
        }
        const basename = this.getNoteBasename(targetDate, noteType);
        if (basename === null) {
            return null;
        }
        const file = this.findFileInFolderByBasename(searchFolder, basename);
        if (file === null) {
            return null;
        }
        return file.path;
    }

    private findFileInFolderByBasename(folderPath: string, basename: string): TFile | null {
        const {vault} = this.plugin.app;
        const abstractFile = vault.getAbstractFileByPath(folderPath);
        if (abstractFile === null) {
            return null;
        }
        if (abstractFile instanceof TFile) {
            if (abstractFile.name === basename) {
                return abstractFile;
            }
            return null;
        }
        if (abstractFile instanceof TFolder) {
            return this.findFileInFolderByBasenameImpl(abstractFile, basename);
        }
        return null;
    }

    private findFileInFolderByBasenameImpl(folder: TFolder, basename: string): TFile | null {
        for (const child of folder.children) {
            if (child instanceof TFile) {
                if (child.name === basename) {
                    return child;
                }
            }
            else if (child instanceof TFolder) {
                const result = this.findFileInFolderByBasenameImpl(child, basename);
                if (result !== null) {
                    return result;
                }
            }
        }
        return null;
    }

    public openNoteBySelectedItem(selectedItem: SelectedItem): void {
        if (selectedItem.type === SelectedItemType.DAY_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.DAILY);
        }
        else if (selectedItem.type === SelectedItemType.WEEK_INDEX_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.WEEKLY)
        }
        else if (selectedItem.type === SelectedItemType.MONTH_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.MONTHLY)
        }
        else if (selectedItem.type === SelectedItemType.QUARTER_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.QUARTERLY)
        }
        else if (selectedItem.type === SelectedItemType.YEAR_ITEM) {
            this.openNoteByNoteType(selectedItem.date, NoteType.YEARLY)
        }
    }

    public openNoteByNoteType(date: DateTime, noteType: NoteType): void {
        let noteFilename = this.getExistingNoteFilename(date, noteType);
        if (noteFilename === null) {
            noteFilename = this.getNoteFilename(date, noteType);
        }
        if (noteFilename === null) {
            return;
        }
        this.noteType = noteType;
        this.openNoteByFilename(new Path(noteFilename));
    }

    public openNoteByFilename(filename: Path): void {
        const vault = this.plugin.app.vault;
        const file = vault.getAbstractFileByPath(filename.string);
        if (file !== null) {
            this.openNoteTabView(file as TFile);
            return;
        }

        // 检查新建笔记时是否需要弹窗
        if (this.plugin.database.setting.shouldConfirmBeforeCreatingNote) {
            const modal = new ConfirmCreatingNoteModal(filename, this.plugin);
            modal.open();
        }
        else {
            setTimeout(() => this.createNote(filename), 0);
        }
    }

    public async createNote(filename: Path): Promise<void> {
        const abstractFile: TAbstractFile = await PathUtil.create(filename, this.plugin.app.vault);
        await this.openNoteTabView(abstractFile as TFile);
        this.plugin.templateController.insertTemplate(this.noteType);
        // 新建文件之后，需要更新统计信息
        this.plugin.noteStatisticController.addTaskByFile(abstractFile);
    }

    private async openNoteTabView(tFile: TFile): Promise<void> {
        // 寻找已打开的标签页
        let targetView: MarkdownView | null = null;
        app.workspace.iterateRootLeaves(leaf => {
            if (leaf.getViewState().type === "markdown" && leaf.getDisplayText() === tFile.basename) {
                let view = leaf.view as MarkdownView;
                if (view.file !== null && view.file.path === tFile.path && targetView === null) {
                    targetView = view;
                }
            }
        });

        if (targetView === null) {
            targetView = new MarkdownView(app.workspace.getLeaf("tab"));
            const targetLeaf: WorkspaceLeaf = targetView.leaf;
            await targetLeaf.openFile(tFile);
        }
        app.workspace.revealLeaf(targetView.leaf);
        // 移动焦点到笔记编辑区域
        app.workspace.setActiveLeaf(targetView.leaf, {focus: true});
    }

}
