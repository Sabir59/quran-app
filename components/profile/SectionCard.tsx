import { StyleSheet, Text, View } from 'react-native';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <View style={styles.wrap}>
      <Text className="text-[11px] font-bold text-muted-foreground tracking-widest mb-2 ml-1">
        {title.toUpperCase()}
      </Text>
      <View
        className="bg-card rounded-2xl overflow-hidden"
        style={styles.shadow}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 24,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
