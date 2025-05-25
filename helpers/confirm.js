// helpers/confirm.js
import { showConfirm, hideConfirm } from '../features/ui/confirmSlice';
import store from '../src/store';

export const confirm = (message, title = 'Confirm') => {
    return new Promise((resolve) => {
        const handleConfirm = () => resolve(true);
        const handleCancel = () => resolve(false);

        store.dispatch(showConfirm({
            message,
            title,
            onConfirm: handleConfirm,
            onCancel: handleCancel
        }));
    });
};
