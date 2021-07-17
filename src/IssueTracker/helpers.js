export const openInNewTab = (href) =>
    Object.assign(document.createElement('a'), {
        target: '_blank',
        href
    }).click()
