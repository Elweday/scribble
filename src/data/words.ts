import words from  "./words.json"

const n = words.data.length;
export const getRandomWord = () => words.data[Math.floor(Math.random() * n)]
export const getRandomWords = (n: number) =>  {
    const randomWords = []
    for (let i = 0; i < n; i++) {
        randomWords.push(getRandomWord())
    }
    return randomWords as string[];
}
