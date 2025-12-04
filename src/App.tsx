import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  Network,
  Mnemonic,
  WordCount,
  DescriptorSecretKey,
  Descriptor,
  Wallet,
  Persister,
  KeychainKind,
  type AddressInfo,
} from 'bdk-rn';

export default function App() {
  const [address, setAddress] = useState<string>('');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadWallet = async () => {
      try {
        // Generate a new mnemonic
        // const mnemonicObj = new Mnemonic(WordCount.Words12);
        // const mnemonicWords = mnemonicObj.toString();
        // setMnemonic(mnemonicWords);

        const recoveryPhrase = "awesome awesome awesome awesome awesome awesome awesome awesome awesome awesome awesome awesome"
        const mnemonic = Mnemonic.fromString(recoveryPhrase)
        setMnemonic(recoveryPhrase)

        // Create descriptor secret key from mnemonic
        const secretKey = new DescriptorSecretKey(
          Network.Signet,
          mnemonic,
          undefined
        );

        // Get the public key for creating descriptors
        // const publicKey = secretKey.asPublic();

        // Create descriptors using wpkh (witness public key hash) with BIP84 paths
        // For signet, we use coin type 1 (m/84'/1'/0'/0/* for external, m/84'/1'/0'/1/* for internal)
        const descriptor = Descriptor.newBip86(
          secretKey,
          KeychainKind.External,
          Network.Signet,
        );
        // const internalDescriptor = new Descriptor(
        //   `wpkh(${publicKey.toString()}/84h/1h/0h/1/*)`,
        //   Network.Signet
        // );

        // Create in-memory persister
        const persister = Persister.newInMemory();

        // Create wallet
        const wallet = Wallet.createSingle(
          descriptor,
          Network.Signet,
          persister,
        );

        // Get address at index 0
        const addressInfo: AddressInfo = wallet.revealNextAddress(
          KeychainKind.External
        );
        setAddress(addressInfo.address.toString());
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        console.error('Error loading wallet:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWallet();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading wallet...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BDK React Native Wallet</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Network:</Text>
        <Text style={styles.value}>Signet</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Mnemonic:</Text>
        <Text style={styles.mnemonic}>{mnemonic}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Address at Index 0:</Text>
        <Text style={styles.address}>{address}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  address: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#0066cc',
  },
  mnemonic: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
