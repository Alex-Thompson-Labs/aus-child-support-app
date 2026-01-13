type Listener = () => void;

class EventBus {
    private listeners: { [key: string]: Listener[] } = {};

    subscribe(event: string, callback: Listener): () => void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);

        // Return unsubscribe function
        return () => {
            this.listeners[event] = this.listeners[event].filter(
                (cb) => cb !== callback
            );
        };
    }

    emit(event: string): void {
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback) => callback());
        }
    }
}

export const eventBus = new EventBus();
