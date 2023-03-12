# Mohammed Imran

Use this for Theme automatic theme switching

```html
<script async type="text/javascript">
    const theme = JSON.parse(localStorage.theme || 'null');

    try {
        if (
            theme === 'dark' ||
            (!theme &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark');
            document
                .querySelector('meta[name="theme-color"]')
                ?.setAttribute('content', '#242424');
        } else {
            document
                .querySelector('meta[name="theme-color"]')
                ?.setAttribute('content', '#f0f0f0');
            document.documentElement.classList.remove('dark');
        }
    } catch (_) {}

    function setThemeClass(theme) {
        try {
            if (
                theme === 'dark' ||
                (!theme &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches)
            ) {
                document.documentElement.classList.add('dark');
                document
                    .querySelector('meta[name="theme-color"]')
                    ?.setAttribute('content', '${COLORS.DARK}');
            } else {
                document
                    .querySelector('meta[name="theme-color"]')
                    ?.setAttribute('content', '${COLORS.LIGHT}');
                document.documentElement.classList.remove('dark');
            }
        } catch (_) {}
    }

    window.setThemeClass = window.setThemeClass || setThemeClass;
</script>
```
