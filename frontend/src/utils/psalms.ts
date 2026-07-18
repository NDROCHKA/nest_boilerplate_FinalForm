export interface Scripture {
  text: string;
  reference: string;
}

export const PSALMS_AND_VERSES: Scripture[] = [
  {
    text: "Put on the full armor of God, so that you can take your stand against the devil’s schemes.",
    reference: "Ephesians 6:11",
  },
  {
    text: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.",
    reference: "Psalm 28:7",
  },
  {
    text: "He will cover you with his feathers, and under his wings you will find refuge; his faithfulness will be your shield and rampart.",
    reference: "Psalm 91:4",
  },
  {
    text: "The Lord is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge, my shield and the horn of my salvation, my stronghold.",
    reference: "Psalm 18:2",
  },
  {
    text: "Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.",
    reference: "Deuteronomy 31:6",
  },
  {
    text: "Praise be to the Lord my Rock, who trains my hands for war, my fingers for battle.",
    reference: "Psalm 144:1",
  },
  {
    text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
    reference: "Psalm 23:4",
  },
  {
    text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
  },
  {
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31",
  },
  {
    text: "Every word of God is flawless; he is a shield to those who take refuge in him.",
    reference: "Proverbs 30:5",
  },
  {
    text: "Your word is a lamp for my feet, a light on my path.",
    reference: "Psalm 119:105",
  },
  {
    text: "God is our refuge and strength, an ever-present help in trouble.",
    reference: "Psalm 46:1",
  },
  {
    text: "What, then, shall we say in response to these things? If God is for us, who can be against us?",
    reference: "Romans 8:31",
  },
  {
    text: "As for God, his way is perfect: The Lord’s word is flawless; he shields all who take refuge in him.",
    reference: "Psalm 18:30",
  },
  {
    text: "But you, Lord, are a shield around me, my glory, the One who lifts my head high.",
    reference: "Psalm 3:3",
  },
  {
    text: "The night is nearly over; the day is almost here. So let us put aside the deeds of darkness and put on the armor of light.",
    reference: "Romans 13:12",
  },
  {
    text: "Therefore put on the full armor of God, so that when the day of evil comes, you may be able to stand your ground.",
    reference: "Ephesians 6:13",
  },
  {
    text: "The Lord will keep you from all harm—he will watch over your life; the Lord will watch over your coming and going both now and forevermore.",
    reference: "Psalm 121:7-8",
  },
];

/**
 * Gets a deterministic daily verse based on the current calendar day of the year.
 */
export const getDailyPsalm = (): Scripture => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = dayOfYear % PSALMS_AND_VERSES.length;
  return PSALMS_AND_VERSES[index];
};
