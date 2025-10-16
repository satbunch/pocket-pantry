import { Redirect } from 'expo-router';
import 'react-native-css-interop/jsx-runtime';

export default function Index() {
  return <Redirect href="/inventory" />;
}
