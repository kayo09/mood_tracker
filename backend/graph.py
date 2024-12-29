class EmotionSelector:
    def __init__(self):
        # Primary emotions and their related secondary/tertiary emotions
        self.emotion_hierarchy = {
            'Joy': {
                'Contentment': ['Peace', 'Satisfaction', 'Comfort'],
                'Happiness': ['Cheerfulness', 'Pleasure', 'Optimism'],
                'Excitement': ['Enthusiasm', 'Thrill', 'Anticipation'],
                'Pride': ['Confidence', 'Achievement', 'Self-assurance']
            },
            'Sadness': {
                'Melancholy': ['Longing', 'Wistfulness', 'Nostalgia'],
                'Disappointment': ['Regret', 'Frustration', 'Defeat'],
                'Grief': ['Loss', 'Heartache', 'Sorrow'],
                'Loneliness': ['Isolation', 'Abandonment', 'Disconnection']
            },
            'Anger': {
                'Frustration': ['Irritation', 'Annoyance', 'Agitation'],
                'Rage': ['Fury', 'Outrage', 'Hostility'],
                'Resentment': ['Bitterness', 'Jealousy', 'Envy'],
                'Indignation': ['Offense', 'Displeasure', 'Contempt']
            },
            'Fear': {
                'Anxiety': ['Worry', 'Nervousness', 'Unease'],
                'Insecurity': ['Self-doubt', 'Vulnerability', 'Inadequacy'],
                'Panic': ['Terror', 'Horror', 'Dread'],
                'Apprehension': ['Caution', 'Hesitation', 'Uncertainty']
            },
            'Love': {
                'Affection': ['Fondness', 'Warmth', 'Tenderness'],
                'Compassion': ['Empathy', 'Understanding', 'Kindness'],
                'Romance': ['Passion', 'Attraction', 'Desire'],
                'Connection': ['Bonding', 'Attachment', 'Closeness']
            }
        }
