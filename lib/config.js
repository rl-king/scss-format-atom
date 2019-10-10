module.exports = {
    formatOnSave: {
        title: 'Format on save',
        description: 'Do we format when you save files?',
        type: 'boolean',
        default: true,
        order: 1,
    },
    showNotifications: {
        title: 'Show notifications on save',
        description: 'Do you want to see the bar when we save?',
        type: 'boolean',
        default: false,
        order: 2,
    },
    showErrorNotifications: {
        title: 'Show error notifications on save',
        description: 'Do you want to see the bar when we save?',
        type: 'boolean',
        default: true,
        order: 3,
    }
};
