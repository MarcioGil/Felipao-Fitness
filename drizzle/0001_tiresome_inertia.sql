CREATE TABLE `exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`muscleGroup` varchar(100) NOT NULL,
	`exerciseType` enum('funcional','maquinario','peso_livre','cardio','hiit') NOT NULL,
	`difficulty` enum('facil','intermediario','dificil') NOT NULL,
	`instructions` text,
	`icon` varchar(255),
	`videoUrl` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress_tracking` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`weight` int,
	`bodyFat` int,
	`measurements` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `progress_tracking_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`age` int,
	`weight` int,
	`height` int,
	`biotype` enum('ectomorfo','mesomorfo','endomorfo'),
	`experience` enum('iniciante','intermediario','avancado'),
	`objective` enum('hipertrofia','emagrecimento','resistencia','funcional'),
	`daysPerWeek` int,
	`preferredExerciseType` enum('funcional','maquinario','peso_livre','cardio','hiit'),
	`injuries` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `workout_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`workoutId` int,
	`date` timestamp NOT NULL DEFAULT (now()),
	`durationMinutes` int,
	`exercisesCompleted` int,
	`totalExercises` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workout_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`workoutType` enum('full_body','abc','abcde','push_pull_legs') NOT NULL,
	`durationMinutes` int,
	`difficulty` enum('facil','intermediario','dificil') NOT NULL,
	`generatedByAI` boolean NOT NULL DEFAULT true,
	`content` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workouts_id` PRIMARY KEY(`id`)
);
