import {Style} from '../../styles/entities/style.entity';
import {LastGeneration} from './lastGeneration.entity';

export class User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    styles?: Style[];
    frequencies?: string[];
    lastGenerationsAsc?: LastGeneration[];

    public constructor(
        id: string,
        firstname: string,
        lastname: string,
        email: string,
        styles?: Style[],
        frequencies?: string[],
        lastGenerationsAsc?: LastGeneration[],
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.styles = styles;
        this.frequencies = frequencies;
        this.lastGenerationsAsc = lastGenerationsAsc;
    }

    static fromFirestoreDocument(id: any, data: any): User {
        return new User(
            id,
            data.firstname,
            data.lastname,
            data.email,
            data.styles,
            data.frequencies,
            data.lastGenerationsAsc != null
                ? data.lastGenerationsAsc.map(
                    (lastGeneration: { generationId: any; insertedTimestamp: any }) =>
                        LastGeneration.fromFirestoreDocument(
                            lastGeneration.generationId,
                            lastGeneration.insertedTimestamp,
                        ),
                )
                : [],
        );
    }

    static fromJson(data: any): User {
        return new User(
            data.id,
            data.firstname,
            data.lastname,
            data.email,
            data.styles,
            data.frequencies,
            data.lastGenerationsAsc,
        );
    }

    toFirestoreDocument(): any {
        const firestoreDocument: any = {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            styles: this.styles ? this.styles : [],
            frequencies: this.frequencies ? this.frequencies : [],
            lastGenerationsAsc: this.lastGenerationsAsc
                ? this.lastGenerationsAsc.map((lastGeneration) =>
                    lastGeneration.toFirestoreDocument(),
                )
                : [],
        };
        //Remove all undefined values
        Object.keys(firestoreDocument).forEach(
            (key) =>
                firestoreDocument[key] === undefined && delete firestoreDocument[key],
        );

        return firestoreDocument;
    }

    toJson(): any {
        return {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            styles: this.styles ? this.styles : [],
            frequencies: this.frequencies ? this.frequencies : [],
            lastGenerationsAsc: this.lastGenerationsAsc
                ? this.lastGenerationsAsc.map((lastGeneration) =>
                    lastGeneration.toJson(),
                )
                : [],
        };
    }

    addGenerationId(lastGeneration: LastGeneration) {
        if (this.lastGenerationsAsc === undefined) {
            this.lastGenerationsAsc = [];
        }

        //If the day/month of the first generation is the same as the day/month of the generation to add, we add the generation to the list
        //Otherwise, we wipe the list and add the generation
        if (this.lastGenerationsAsc.length !== 0) {
            console.log(this.lastGenerationsAsc);
            const lastGenerationDate =
                this.lastGenerationsAsc[0].insertedTimestamp.toDate();
            const generationDate = lastGeneration.insertedTimestamp.toDate();
            if (
                lastGenerationDate.getDate() === generationDate.getDate() &&
                lastGenerationDate.getMonth() === generationDate.getMonth()
            ) {
                this.lastGenerationsAsc.unshift(lastGeneration);
            } else {
                this.lastGenerationsAsc = [lastGeneration];
            }
        } else {
            this.lastGenerationsAsc = [lastGeneration];
        }
    }

    canGenerateImage(): boolean {
        if (this.lastGenerationsAsc.length < 3) {
            return true;
        } else {
            const lastGenerationDate = this.lastGenerationsAsc[0].insertedTimestamp.toDate();
            const currentDate = new Date();
            if (
                lastGenerationDate.getDate() === currentDate.getDate() &&
                lastGenerationDate.getMonth() === currentDate.getMonth()
            ) {
                return false;
            } else {
                return true;
            }
        }
    }
}