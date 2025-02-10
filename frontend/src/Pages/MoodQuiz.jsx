import React, { useEffect, useState } from 'react';
import './MoodQuiz.css';

const BASE_URL="http://localhost:8000/";
const emotions=["primary_emotions","secondary_emotions","tertiary_emotions"];
const primary_response= await fetch(BASE_URL+emotions[0])
const json= await primary_response.json()

export default function MoodQuiz() {
    return(
    <div className="container">
        <div className="quiz">
            <button>Happy</button>
            <button>Sad</button>
            <button>Angry</button>
            <button>Stressed</button>
            <button>Excited</button>
            <button>Confused</button>
        </div>
        </div>
    )
}