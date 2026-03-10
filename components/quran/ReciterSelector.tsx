import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

type Props = {
  value: string;
  onChange: (reciter: string) => void;
};

const RECITERS = [
  { code: 'ar.alafasy', label: 'Alafasy' },
  { code: 'ar.hudhaify', label: 'Hudhaify' },
  { code: 'ar.minshawi', label: 'Minshawi' },
];

export function ReciterSelector({ value, onChange }: Props) {
  return (
    <View className="gap-2">
      <Text variant="large">Reciter</Text>
      <View className="flex-row gap-2">
        {RECITERS.map((r) => (
          <Button key={r.code} variant={value === r.code ? 'default' : 'outline'} onPress={() => onChange(r.code)}>
            <Text>{r.label}</Text>
          </Button>
        ))}
      </View>
    </View>
  );
}
