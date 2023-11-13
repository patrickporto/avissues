async function checkMicrophoneStatus() {
    try {
        const status = await navigator.permissions.query({
            name: "microphone",
        });
        return status.state;
    } catch (e) {
        console.error("Check camera status not supported.");
        return "granted";
    }
}

async function checkCameraStatus() {
    try {
        const status = await navigator.permissions.query({
            name: "camera",
        });
        return status.state;
    } catch (e) {
        console.error("Check camera status not supported.");
        return "granted";
    }
}

async function detectMicrophoneIssues() {
    if (![AVSettings.AV_MODES.AUDIO, AVSettings.AV_MODES.AUDIO_VIDEO].includes(game.webrtc.mode)) {
        return
    }
    const status = await checkMicrophoneStatus()
    switch(status) {
        case "prompt":
            ui.notifications.warn(game.i18n.localize('avissues.PromptBrowserMicrophonePermission'));
            break;
        case "denied":
            ui.notifications.warn(game.i18n.localize('avissues.DeniedBrowserMicrophonePermission'));
            break;
    }
    if (!game.user.hasPermission('BROADCAST_AUDIO')) {
        ui.notifications.warn(game.i18n.localize('avissues.NoBroadcastAudioPermission'));
    }
}
async function detectCameraIssues() {
    if (![AVSettings.AV_MODES.VIDEO, AVSettings.AV_MODES.AUDIO_VIDEO].includes(game.webrtc.mode)) {
    }
    const status = await checkCameraStatus()
    switch(status) {
        case "prompt":
            ui.notifications.warn(game.i18n.localize('avissues.PromptBrowserCameraPermission'));
            break;
        case "denied":
            ui.notifications.warn(game.i18n.localize('avissues.DeniedBrowserCameraPermission'));
            break;
    }
    if (!game.user.hasPermission('BROADCAST_VIDEO')) {
        ui.notifications.warn(game.i18n.localize('avissues.NoBroadcastVideoPermission'));
    }
}

Hooks.on('ready', async () => {
    if (game.webrtc.mode === AVSettings.AV_MODES.DISABLED) {
        return;
    }
    detectMicrophoneIssues()
    detectCameraIssues()
});
