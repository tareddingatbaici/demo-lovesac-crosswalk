export function loadScript(url, attrs) {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.src = url;
    if (attrs) {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const attr in attrs) {
            script.setAttribute(attr, attrs[attr]);
        }
    }
    head.append(script);
    return script;
}