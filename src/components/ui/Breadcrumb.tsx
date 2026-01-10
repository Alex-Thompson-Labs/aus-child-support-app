import { isWeb, webClickableStyles } from '@/src/utils/responsive';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface BreadcrumbItem {
    label: string;
    path?: string; // If undefined, this is the current page (not clickable)
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

/**
 * Breadcrumb Navigation Component
 * 
 * Displays a horizontal breadcrumb trail matching the BreadcrumbList schema.
 * The last item is treated as the current page and is not clickable.
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
    const router = useRouter();

    return (
        <View
            style={styles.container}
            accessible={true}
            accessibilityLabel="Breadcrumb navigation"
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isClickable = !isLast && item.path;

                return (
                    <View key={index} style={styles.itemContainer}>
                        {index > 0 && <Text style={styles.separator}>›</Text>}

                        {isClickable ? (
                            <Pressable
                                onPress={() => router.push(item.path as '/')}
                                style={[styles.link, isWeb && webClickableStyles]}
                                accessibilityRole="link"
                                accessibilityLabel={`Go to ${item.label}`}
                            >
                                <Text style={styles.linkText}>{item.label}</Text>
                            </Pressable>
                        ) : (
                            <Text style={styles.currentText} numberOfLines={1}>
                                {item.label}
                            </Text>
                        )}
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 4,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    separator: {
        fontSize: 14,
        color: '#94a3b8', // Slate 400
        marginHorizontal: 2,
    },
    link: {
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    linkText: {
        fontSize: 13,
        color: '#2563EB', // Brand blue
        fontWeight: '500',
    },
    currentText: {
        fontSize: 13,
        color: '#64748b', // Slate 500
        fontWeight: '500',
        maxWidth: 200,
    },
});
