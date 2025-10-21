import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedBackground = () => {
    const particles = useRef([]);
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {

        particles.current = Array.from({ length: 25 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            animatedX: new Animated.Value(Math.random() * SCREEN_WIDTH),
            animatedY: new Animated.Value(Math.random() * SCREEN_HEIGHT),
            opacity: new Animated.Value(Math.random() * 0.6 + 0.3),
            scale: new Animated.Value(1),
        }));

        // Pulse animation 
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Animate particles
        particles.current.forEach((particle, index) => {
            const duration = 20000 + Math.random() * 10000;
            const delay = index * 150;

            const animateParticle = () => {
                const endX = Math.random() * SCREEN_WIDTH;
                const endY = Math.random() * SCREEN_HEIGHT;

                Animated.parallel([
                    Animated.timing(particle.animatedX, {
                        toValue: endX,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.animatedY, {
                        toValue: endY,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(particle.opacity, {
                                toValue: 0.8,
                                duration: duration / 3,
                                useNativeDriver: true,
                            }),
                            Animated.timing(particle.opacity, {
                                toValue: 0.3,
                                duration: duration / 3,
                                useNativeDriver: true,
                            }),
                        ])
                    ),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(particle.scale, {
                                toValue: 1.5,
                                duration: duration / 2,
                                useNativeDriver: true,
                            }),
                            Animated.timing(particle.scale, {
                                toValue: 1,
                                duration: duration / 2,
                                useNativeDriver: true,
                            }),
                        ])
                    ),
                ]).start(() => {
                    particle.animatedX.setValue(Math.random() * SCREEN_WIDTH);
                    particle.animatedY.setValue(Math.random() * SCREEN_HEIGHT);
                    animateParticle();
                });
            };

            setTimeout(() => animateParticle(), delay);
        });
    }, []);

    const gradientOpacity = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 0.7],
    });

    return (
        <View style={styles.backgroundContainer}>
            <Animated.View style={[styles.gradientOverlay1, { opacity: gradientOpacity }]} />
            <Animated.View style={[styles.gradientOverlay2, { opacity: gradientOpacity }]} />
            <Animated.View style={[styles.gradientOverlay3, { opacity: gradientOpacity }]} />

            {/* Connection Lines */}
            <View style={styles.linesContainer}>
                {[...Array(12)].map((_, i) => (
                    <View
                        key={`line-${i}`}
                        style={[
                            styles.connectionLine,
                            {
                                top: `${5 + i * 8}%`,
                                left: `${Math.random() * 80}%`,
                                width: 100 + Math.random() * 150,
                                transform: [{ rotate: `${Math.random() * 360}deg` }],
                                opacity: 0.15 + Math.random() * 0.15,
                            },
                        ]}
                    />
                ))}
            </View>

            {/* Particles */}
            {particles.current.map((particle) => (
                <Animated.View
                    key={particle.id}
                    style={[
                        styles.particle,
                        {
                            width: particle.size,
                            height: particle.size,
                            transform: [
                                { translateX: particle.animatedX },
                                { translateY: particle.animatedY },
                                { scale: particle.scale },
                            ],
                            opacity: particle.opacity,
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        opacity: 0.5,
    },
    gradientOverlay1: {
        position: 'absolute',
        top: '15%',
        left: '-10%',
        width: 500,
        height: 500,
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        borderRadius: 250,
        transform: [{ scale: 1.5 }],
    },
    gradientOverlay2: {
        position: 'absolute',
        top: '55%',
        right: '-15%',
        width: 400,
        height: 400,
        backgroundColor: 'rgba(234, 179, 8, 0.08)',
        borderRadius: 200,
        transform: [{ scale: 1.5 }],
    },
    gradientOverlay3: {
        position: 'absolute',
        top: '35%',
        left: '30%',
        width: 300,
        height: 300,
        backgroundColor: 'rgba(139, 92, 246, 0.06)',
        borderRadius: 150,
        transform: [{ scale: 1.3 }],
    },
    linesContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    connectionLine: {
        position: 'absolute',
        height: 1.5,
        backgroundColor: 'rgba(59, 130, 246, 0.25)',
        borderRadius: 1,
    },
    particle: {
        position: 'absolute',
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 50,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
    },
});

export default AnimatedBackground;