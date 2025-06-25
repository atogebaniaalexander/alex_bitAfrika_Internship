import { AppDataSource } from "../data-source";


export const connectDatabase = async (): Promise<void> => {
    try{
        await AppDataSource.initialize();
        console.log("Database connected successfully");
    }catch(error){
        console.error("Error connecting to the database");
        process.exit(1);
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    try {
        await AppDataSource.destroy();
        console.log("Database disconnected successfully");
    } catch (error) {
        console.error("Error disconnecting from the database");
    }
};

export { AppDataSource };