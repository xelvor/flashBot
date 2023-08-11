export const badges = [
    {
        name: 'Bot owner',
        icon: '<:owner:1139452297450098820>',
        value: 'owner'
    },
    {
        name: 'Bot staff',
        icon: '<:staff:1139452295038378016>',
        value: 'staff'
    }
]

export function getBadgeNameByValue(value: string) {
    const badge = badges.find(b => b.value === value);
    return badge ? badge.name : 'Unknown Badge';
}