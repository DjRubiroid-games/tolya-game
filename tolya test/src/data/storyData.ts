import { VNNode } from '../components/VisualNovelScene';

// Здесь вы можете писать свою историю
export const STORY_DATA: VNNode[] = [
    {
        id: 'start',
        speaker: 'Толя',
        text: 'Напишите здесь начало вашей истории...',
        backgroundImage: './assets/lvl2.png', // Картинка по умолчанию
        // videoBackground: './assets/your-video.mp4', // Раскомментируйте, чтобы использовать видео на фоне
        choices: [
            { text: 'Вариант ответа 1', nextNodeId: 'next_step' },
            { text: 'Вариант ответа 2', nextNodeId: 'start' }
        ]
    },
    {
        id: 'next_step',
        speaker: 'Персонаж',
        text: 'Это следующий узел сюжета. Вы можете добавлять их сколько угодно.',
        choices: [
            { text: 'К победе!', nextNodeId: 'WIN' },
            { text: 'К проигрышу...', nextNodeId: 'LOST' }
        ]
    }
];
