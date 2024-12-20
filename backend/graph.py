import streamlit as st
import json
from datetime import datetime
import os

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
        
        # Initialize session state for tracking selections
        if 'selected_emotions' not in st.session_state:
            st.session_state.selected_emotions = []
        if 'current_level' not in st.session_state:
            st.session_state.current_level = 'primary'
        if 'selected_primary' not in st.session_state:
            st.session_state.selected_primary = None
        if 'selected_secondary' not in st.session_state:
            st.session_state.selected_secondary = None

    def reset_selections(self):
        """Reset all selections"""
        st.session_state.selected_emotions = []
        st.session_state.current_level = 'primary'
        st.session_state.selected_primary = None
        st.session_state.selected_secondary = None

    def save_selection(self):
        """Save current emotion selections to JSON"""
        if st.session_state.selected_emotions:
            emotion_data = {
                'timestamp': datetime.now().isoformat(),
                'emotions': st.session_state.selected_emotions
            }
            
            # Create emotions directory if it doesn't exist
            if not os.path.exists('emotions'):
                os.makedirs('emotions')
            
            # Save to JSON file
            filename = f"emotions/emotion_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(filename, 'w') as f:
                json.dump(emotion_data, f, indent=4)
            
            return filename
        return None

    def run(self):
        """Run the emotion selector interface"""
        st.title("Emotion Selector")
        st.write("Select your emotions by clicking through the boxes")

        # Add Reset button
        if st.button("Reset Selection"):
            self.reset_selections()

        # Display current selections
        if st.session_state.selected_emotions:
            st.write("Your emotion path:", " → ".join(st.session_state.selected_emotions))

        # Primary emotion selection
        if st.session_state.current_level == 'primary':
            st.subheader("How are you feeling?")
            cols = st.columns(len(self.emotion_hierarchy))
            for i, (emotion, _) in enumerate(self.emotion_hierarchy.items()):
                with cols[i]:
                    if st.button(emotion, key=f"primary_{emotion}"):
                        st.session_state.selected_primary = emotion
                        st.session_state.current_level = 'secondary'
                        st.session_state.selected_emotions = [emotion]
                        st.rerun()

        # Secondary emotion selection
        elif st.session_state.current_level == 'secondary':
            st.subheader(f"Select a more specific aspect of {st.session_state.selected_primary}")
            secondary_emotions = self.emotion_hierarchy[st.session_state.selected_primary]
            cols = st.columns(len(secondary_emotions))
            for i, (emotion, _) in enumerate(secondary_emotions.items()):
                with cols[i]:
                    if st.button(emotion, key=f"secondary_{emotion}"):
                        st.session_state.selected_secondary = emotion
                        st.session_state.current_level = 'tertiary'
                        st.session_state.selected_emotions.append(emotion)
                        st.rerun()

        # Tertiary emotion selection
        elif st.session_state.current_level == 'tertiary':
            st.subheader(f"Select the most specific feeling of {st.session_state.selected_secondary}")
            tertiary_emotions = self.emotion_hierarchy[st.session_state.selected_primary][st.session_state.selected_secondary]
            cols = st.columns(len(tertiary_emotions))
            for i, emotion in enumerate(tertiary_emotions):
                with cols[i]:
                    if st.button(emotion, key=f"tertiary_{emotion}"):
                        st.session_state.selected_emotions.append(emotion)
                        # Save selections
                        saved_file = self.save_selection()
                        if saved_file:
                            st.success(f"Emotions saved to {saved_file}")
                            # Display save button for downloading
                            with open(saved_file, 'r') as f:
                                st.download_button(
                                    label="Download Emotion Data",
                                    data=f.read(),
                                    file_name="emotion_data.json",
                                    mime="application/json"
                                )
                        st.rerun()

        # Back button (except on primary level)
        if st.session_state.current_level != 'primary':
            if st.button("← Back"):
                if st.session_state.current_level == 'tertiary':
                    st.session_state.current_level = 'secondary'
                    st.session_state.selected_emotions.pop()
                elif st.session_state.current_level == 'secondary':
                    st.session_state.current_level = 'primary'
                    st.session_state.selected_emotions = []
                st.rerun()

def main():
    selector = EmotionSelector()
    selector.run()

if __name__ == "__main__":
    main()