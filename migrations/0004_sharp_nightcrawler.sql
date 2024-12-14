CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`flavor` text NOT NULL,
	`size` text NOT NULL,
	`bag_size` text NOT NULL,
	`quantity` integer NOT NULL,
	`userId` text,
	`createdOn` integer,
	`updatedOn` integer
);
--> statement-breakpoint
CREATE TABLE `user_comments` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`userId` text,
	`createdOn` integer,
	`updatedOn` integer
);
