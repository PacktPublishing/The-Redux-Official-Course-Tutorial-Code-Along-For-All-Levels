import { Provider } from 'react-redux';
import store from '../store';
import './home.css';
import { ComponentType } from 'react';

interface AppProps {
  Component: ComponentType<any>;
  pageProps: any;
}

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;