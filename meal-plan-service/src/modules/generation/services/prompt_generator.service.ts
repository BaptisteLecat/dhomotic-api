import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


@Injectable()
export class PromptGeneratorService {
    async generatePrompt(
        imageStyle: string,
        time: string,
        place: string,
        weather: string,
    ): Promise<string> {
        const model = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9});

        const outputParser = new StringOutputParser();

        const promptTemplate = ChatPromptTemplate.fromTemplate(
            `You are an expert in prompt writing. You have to write a prompt that will be used by an Image generative AI to generate image of landscape for a weather app. You have to well describe the scene like you do if the painter was blind. Because the AI can not known some place, you have to describe it.
    We will give you some informations on the place, the weather, the time..
    Also you have to know that we are in 2023 and it's important to give this context to the AI. You have to well describe the city and the weather.
    You have to complete with any information that can be useful for the image generation.
    Moreover you have to enrich the data given to you with your own knowledge of the place, of the weather, of the time.
    You cannot just say the name of a place or monument, you have to describe it extremely precisely.
    Also you have to add some informations like details : some main known places in the city for example.
    Here is an example of prompt : The sky in Nantes is illuminated with a warm golden light, as the sun rises in the East. The partly cloudy sky is illuminated with vibrant purples and pinks, creating a laid - back atmosphere. In the background, the Loire River proudly flows past the city. The outline of churches and cathedrals can be seen, rising up high above the skyline. The iconic yellow and white Les Machines de l’île gleams against the water, and the air is filled with the sound of chirping birds. The quiet peacefulness of an early morning in the city of Nantes is a sight to behold.
    You can go deeper in details if needed.
    Here are the information given to you :
    image style : {image_style}
    time : {time}
    place : {place}
    weather informations : {weather}`
        );

        const chain = promptTemplate.pipe(model).pipe(outputParser);
        return await chain.invoke({ image_style: imageStyle, time: time, place: place, weather: weather }).then((res) => {
            console.log(res);
            return res.replace(/(\r\n|\n|\r)/gm, "");
        });


        //{ image_style: "realistic, soft, and lo-fi illustration", time: "early morning (6am)", place: "Nantes", weather: "partly cloudy" }

        // return await chain.call({ image_style: imageStyle, time: time, place: place, weather: weather }).then((res) => {
        //     console.log(res);
        //     return res.text.replace(/(\r\n|\n|\r)/gm, "");
        // });
    }
}
