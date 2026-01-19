import {DateTime} from "luxon";

export interface HolidayInfo {
    isWork: boolean; // true: 补班, false: 放假
    name: string;
}

export class ChineseHolidayUtil {
    private static holidayMap: Map<string, HolidayInfo> = new Map([
        // 2025年
        // 元旦
        ["2025-01-01", {isWork: false, name: "元旦"}],
        // 春节
        ["2025-01-26", {isWork: true, name: "春节补班"}],
        ["2025-01-28", {isWork: false, name: "春节"}],
        ["2025-01-29", {isWork: false, name: "春节"}],
        ["2025-01-30", {isWork: false, name: "春节"}],
        ["2025-01-31", {isWork: false, name: "春节"}],
        ["2025-02-01", {isWork: false, name: "春节"}],
        ["2025-02-02", {isWork: false, name: "春节"}],
        ["2025-02-03", {isWork: false, name: "春节"}],
        ["2025-02-04", {isWork: false, name: "春节"}],
        ["2025-02-08", {isWork: true, name: "春节补班"}],
        // 清明节
        ["2025-04-04", {isWork: false, name: "清明"}],
        ["2025-04-05", {isWork: false, name: "清明"}],
        ["2025-04-06", {isWork: false, name: "清明"}],
        // 劳动节
        ["2025-04-27", {isWork: true, name: "劳动节补班"}],
        ["2025-05-01", {isWork: false, name: "劳动节"}],
        ["2025-05-02", {isWork: false, name: "劳动节"}],
        ["2025-05-03", {isWork: false, name: "劳动节"}],
        ["2025-05-04", {isWork: false, name: "劳动节"}],
        ["2025-05-05", {isWork: false, name: "劳动节"}],
        // 端午节
        ["2025-05-31", {isWork: false, name: "端午"}],
        ["2025-06-01", {isWork: false, name: "端午"}],
        ["2025-06-02", {isWork: false, name: "端午"}],
        // 国庆节、中秋节
        ["2025-09-28", {isWork: true, name: "国庆补班"}],
        ["2025-10-01", {isWork: false, name: "国庆"}],
        ["2025-10-02", {isWork: false, name: "国庆"}],
        ["2025-10-03", {isWork: false, name: "国庆"}],
        ["2025-10-04", {isWork: false, name: "国庆"}],
        ["2025-10-05", {isWork: false, name: "国庆"}],
        ["2025-10-06", {isWork: false, name: "国庆"}],
        ["2025-10-07", {isWork: false, name: "国庆"}],
        ["2025-10-08", {isWork: false, name: "国庆"}],
        ["2025-10-11", {isWork: true, name: "国庆补班"}],

        // 2026年
        // 元旦
        ["2026-01-01", {isWork: false, name: "元旦"}],
        ["2026-01-02", {isWork: false, name: "元旦"}],
        ["2026-01-03", {isWork: false, name: "元旦"}],
        ["2026-01-04", {isWork: true, name: "元旦补班"}],
        // 春节
        ["2026-02-14", {isWork: true, name: "春节补班"}],
        ["2026-02-15", {isWork: false, name: "春节"}],
        ["2026-02-16", {isWork: false, name: "春节"}],
        ["2026-02-17", {isWork: false, name: "春节"}],
        ["2026-02-18", {isWork: false, name: "春节"}],
        ["2026-02-19", {isWork: false, name: "春节"}],
        ["2026-02-20", {isWork: false, name: "春节"}],
        ["2026-02-21", {isWork: false, name: "春节"}],
        ["2026-02-22", {isWork: false, name: "春节"}],
        ["2026-02-23", {isWork: false, name: "春节"}],
        ["2026-02-28", {isWork: true, name: "春节补班"}],
        // 清明节
        ["2026-04-04", {isWork: false, name: "清明"}],
        ["2026-04-05", {isWork: false, name: "清明"}],
        ["2026-04-06", {isWork: false, name: "清明"}],
        // 劳动节
        ["2026-05-01", {isWork: false, name: "劳动节"}],
        ["2026-05-02", {isWork: false, name: "劳动节"}],
        ["2026-05-03", {isWork: false, name: "劳动节"}],
        ["2026-05-04", {isWork: false, name: "劳动节"}],
        ["2026-05-05", {isWork: false, name: "劳动节"}],
        ["2026-05-09", {isWork: true, name: "劳动节补班"}],
        // 端午节
        ["2026-06-19", {isWork: false, name: "端午"}],
        ["2026-06-20", {isWork: false, name: "端午"}],
        ["2026-06-21", {isWork: false, name: "端午"}],
        // 中秋节
        ["2026-09-25", {isWork: false, name: "中秋"}],
        ["2026-09-26", {isWork: false, name: "中秋"}],
        ["2026-09-27", {isWork: false, name: "中秋"}],
        // 国庆节
        ["2026-09-20", {isWork: true, name: "国庆补班"}],
        ["2026-10-01", {isWork: false, name: "国庆"}],
        ["2026-10-02", {isWork: false, name: "国庆"}],
        ["2026-10-03", {isWork: false, name: "国庆"}],
        ["2026-10-04", {isWork: false, name: "国庆"}],
        ["2026-10-05", {isWork: false, name: "国庆"}],
        ["2026-10-06", {isWork: false, name: "国庆"}],
        ["2026-10-07", {isWork: false, name: "国庆"}],
        ["2026-10-10", {isWork: true, name: "国庆补班"}],
    ]);

    public static getHoliday(year: number, month: number, day: number): HolidayInfo | null {
        // 格式化日期 key
        const key = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return this.holidayMap.get(key) || null;
    }

    public static setHolidayData(data: any): void {
        if (!data || typeof data !== 'object') {
            return;
        }

        // 清空或保留内置数据？为了稳妥，我们这里做合并，或者直接覆盖。
        // 考虑到灵活性，如果是从远程更新，我们应该以远程为准。
        // 但这里为了简化，我们假设用户提供的数据是补充或覆盖。
        // 最好的方式是：如果有自定义数据，则优先查自定义，没有再查内置。
        // 但为了性能，我们可以在 setHolidayData 时把数据合并到 map 中。
        // 不过考虑到 this.holidayMap 是静态的且包含硬编码数据，我们最好不要直接修改它，
        // 而是引入一个 dynamicHolidayMap。
        
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const info = data[key];
                if (info && typeof info.isWork === 'boolean' && typeof info.name === 'string') {
                    this.holidayMap.set(key, {
                        isWork: info.isWork,
                        name: info.name
                    });
                }
            }
        }
    }
}
