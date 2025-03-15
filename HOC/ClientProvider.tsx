'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store from '@/store/store';
import { Persistor, persistStore } from 'redux-persist';

// const persistor = persistStore(store);

const ClientProvider = ({ children }: { children: ReactNode }) => {
    const [persistor, setPersistor] = useState<Persistor | null>(null);

    useEffect(() => {
        const clientPersistor = persistStore(store);
        setPersistor(clientPersistor);
    }, []);

    if (!persistor) return null;

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
};
export default ClientProvider;
