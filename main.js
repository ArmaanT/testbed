function parsePreset(input) {
    let str = input;
    let presetSource;
    let packageName;
    let presetName;
    let params;
    if (str.startsWith('github>')) {
        presetSource = 'github';
        str = str.substring('github>'.length);
    } else if (str.startsWith('gitlab>')) {
        presetSource = 'gitlab';
        str = str.substring('gitlab>'.length);
    } else if (str.startsWith('gitea>')) {
        presetSource = 'gitea';
        str = str.substring('gitea>'.length);
    } else if (str.startsWith('local>')) {
        presetSource = 'local';
        str = str.substring('local>'.length);
    } else if (
        !str.startsWith('@') &&
        !str.startsWith(':') &&
        str.includes('/')
    ) {
        presetSource = 'local';
    }
    str = str.replace(/^npm>/, '');
    presetSource = presetSource || 'npm';
    if (str.includes('(')) {
        params = str
            .slice(str.indexOf('(') + 1, -1)
            .split(',')
            .map((elem) => elem.trim());
        str = str.slice(0, str.indexOf('('));
    }
    const presetsPackages = [
        'config',
        'default',
        'docker',
        'group',
        'helpers',
        'monorepo',
        'npm',
        'packages',
        'preview',
        'regexManagers',
        'schedule',
        'workarounds',
    ];
    if (
        presetsPackages.some((presetPackage) => str.startsWith(`${presetPackage}:`))
    ) {
        presetSource = 'internal';
        [packageName, presetName] = str.split(':');
    } else if (str.startsWith(':')) {
        // default namespace
        presetSource = 'internal';
        packageName = 'default';
        presetName = str.slice(1);
    } else if (str.startsWith('@')) {
        // scoped namespace
        [, packageName] = /(@.*?)(:|$)/.exec(str);
        str = str.slice(packageName.length);
        if (!packageName.includes('/')) {
            packageName += '/renovate-config';
        }
        if (str === '') {
            presetName = 'default';
        } else {
            presetName = str.slice(1);
        }
    } else {
        // non-scoped namespace
        [, packageName] = /(.*?)(:|$)/.exec(str);
        presetName = str.slice(packageName.length + 1);
        if (presetSource === 'npm' && !packageName.startsWith('renovate-config-')) {
            packageName = `renovate-config-${packageName}`;
        }
        if (presetName === '') {
            presetName = 'default';
        }
    }
    return { presetSource, packageName, presetName, params };
}

console.log(parsePreset("github>user/repo:abc/123"));
