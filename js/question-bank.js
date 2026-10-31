const BANK_CHAPTER_MAP = {"មេរៀនទី ១ ៖ ចំនួនគត់ (ទំព័រ ១ - ១៤)": "ជំពូកទី ១ ៖ ចំនួន និងប្រមាណវិធី", "មេរៀនទី ២ ៖ តួចែកនិងពហុគុណ (ទំព័រ ១៥ - ២៤)": "ជំពូកទី ១ ៖ ចំនួន និងប្រមាណវិធី", "មេរៀនទី ៣ ៖ ចំនួនគត់រ៉ឺឡាទីប (ទំព័រ ២៥ - ៤០)": "ជំពូកទី ១ ៖ ចំនួន និងប្រមាណវិធី", "មេរៀនទី ៤ ៖ ប្រភាគ (ទំព័រ ៤១ - ៥២)": "ជំពូកទី ១ ៖ ចំនួន និងប្រមាណវិធី", "មេរៀនទី ៥ ៖ ចំនួនទសភាគ (ទំព័រ ៥៣ - ៦២)": "ជំពូកទី ១ ៖ ចំនួន និងប្រមាណវិធី", "មេរៀនទី ៦ ៖ ភាគរយ (ទំព័រ ៦៣ - ៧២)": "ជំពូកទី ១ ៖ ចំនួន និងប្រមាណវិធី", "មេរៀនទី ៧ ៖ រង្វាស់រង្វាល់ (ទំព័រ ៧៣ - ៨០)": "ជំពូកទី ២ ៖ រង្វាស់រង្វាល់ និងពីជគណិត", "មេរៀនទី ៨ ៖ កន្សោមពីជគណិត (ទំព័រ ៨១ - ៩០)": "ជំពូកទី ២ ៖ រង្វាស់រង្វាល់ និងពីជគណិត", "មេរៀនទី ៩ ៖ សមីការដឺក្រេទីមួយមានមួយអញ្ញាត (ទំព័រ ៩១ - ១០០)": "ជំពូកទី ២ ៖ រង្វាស់រង្វាល់ និងពីជគណិត", "មេរៀនទី ១០ ៖ វិសមភាព (ទំព័រ ១០១ - ១០៦)": "ជំពូកទី ២ ៖ រង្វាស់រង្វាល់ និងពីជគណិត", "មេរៀនទី ១១ ៖ ផលធៀបនិងសមាមាត្រ (ទំព័រ ១០៧ - ១១៦)": "ជំពូកទី ២ ៖ រង្វាស់រង្វាល់ និងពីជគណិត", "មេរៀនទី ១២ ៖ សញ្ញាណដំបូងនៃរូបធរណីមាត្រ (ទំព័រ ១១៧ - ១២៦)": "ជំពូកទី ៣ ៖ ធរណីមាត្រ", "មេរៀនទី ១៣ ៖ មុំ (ទំព័រ ១២៧ - ១៣៨)": "ជំពូកទី ៣ ៖ ធរណីមាត្រ", "មេរៀនទី ១៤ ៖ បន្ទាត់ស្រប បន្ទាត់កែង (ទំព័រ ១៣៩ - ១៥០)": "ជំពូកទី ៣ ៖ ធរណីមាត្រ", "មេរៀនទី ១៥ ៖ រូបធរណីមាត្រដែលមានវិមាត្រពីរ (ទំព័រ ១៥១ - ១៦៦)": "ជំពូកទី ៣ ៖ ធរណីមាត្រ", "មេរៀនទី ១៦ ៖ បរិមាត្រនិងផ្ទៃក្រឡាពហុកោណ (ទំព័រ ១៦៧ - ១៧៦)": "ជំពូកទី ៣ ៖ ធរណីមាត្រ", "មេរៀនទី ១៧ ៖ រង្វង់ (ទំព័រ ១៧៧ - ១៨៤)": "ជំពូកទី ៣ ៖ ធរណីមាត្រ", "មេរៀនទី ១៨ ៖ មាឌនិងផ្ទៃក្រឡាខាងនៃសូលីត (ទំព័រ ១៨៥ - ១៩២)": "ជំពូកទី ៣ ៖ ធរណីមាត្រ", "មេរៀនទី ១៩ ៖ ភាពឆ្លុះ (ទំព័រ ១៩៣ - ២០០)": "ជំពូកទី ៣ ៖ ធរណីមាត្រ", "មេរៀនទី ២០ ៖ ប្រូបាប (ទំព័រ ២០១ - ២០៨)": "ជំពូកទី ៤ ៖ ស្ថិតិ និងប្រូបាប", "មេរៀនទី ២១ ៖ ក្រាបសសរ (ទំព័រ ២០៩ - ២១៦)": "ជំពូកទី ៤ ៖ ស្ថិតិ និងប្រូបាប", "មេរៀនទី ២២ ៖ ក្រាបផ្លិត (ទំព័រ ២១៧ - ២២០)": "ជំពូកទី ៤ ៖ ស្ថិតិ និងប្រូបាប", "មេរៀនទី ១ ៖ ចំនួនសនិទាន (ទំព័រ ១ - ១២)": "ជំពូកទី ១ ៖ ចំនួនសនិទាន និងរង្វាស់រង្វាល់", "មេរៀនទី ២ ៖ ស្វ័យគុណ (ទំព័រ ១៣ - ២៦)": "ជំពូកទី ១ ៖ ចំនួនសនិទាន និងរង្វាស់រង្វាល់", "មេរៀនទី ៣ ៖ ទំហំសមាមាត្រនិងភាគរយ (ទំព័រ ២៧ - ៤២)": "ជំពូកទី ១ ៖ ចំនួនសនិទាន និងរង្វាស់រង្វាល់", "មេរៀនទី ៤ ៖ រង្វាស់រង្វាល់ (ទំព័រ ៤៣ - ៥០)": "ជំពូកទី ១ ៖ ចំនួនសនិទាន និងរង្វាស់រង្វាល់", "មេរៀនទី ៥ ៖ កន្សោមពីជគណិត (ទំព័រ ៥១ - ៧៤)": "ជំពូកទី ២ ៖ ពីជគណិត និងក្រាប", "មេរៀនទី ៦ ៖ កន្សោមសនិទាន (ទំព័រ ៧៥ - ៨៨)": "ជំពូកទី ២ ៖ ពីជគណិត និងក្រាប", "មេរៀនទី ៧ ៖ សមីការដឺក្រេទី១មានមួយអញ្ញាត (ទំព័រ ៨៩ - ១០២)": "ជំពូកទី ២ ៖ ពីជគណិត និងក្រាប", "មេរៀនទី ៨ ៖ វិសមីការដឺក្រេទី១មានមួយអញ្ញាត (ទំព័រ ១០៣ - ១១៤)": "ជំពូកទី ២ ៖ ពីជគណិត និងក្រាប", "មេរៀនទី ៩ ៖ ប្លង់កូអរដោនេនិងក្រាប (ទំព័រ ១១៥ - ១២២)": "ជំពូកទី ២ ៖ ពីជគណិត និងក្រាប", "មេរៀនទី ១០ ៖ ស្ថិតិ (ទំព័រ ១២៣ - ១៤០)": "ជំពូកទី ៣ ៖ ស្ថិតិ និងប្រូបាប", "មេរៀនទី ១១ ៖ ប្រូបាប (ទំព័រ ១៤១ - ១៤៦)": "ជំពូកទី ៣ ៖ ស្ថិតិ និងប្រូបាប", "មេរៀនទី ១២ ៖ ការប្រៀបធៀបត្រីកោណ (ទំព័រ ១៤៧ - ១៦៨)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងមាត្រដ្ឋាន", "មេរៀនទី ១៣ ៖ ចតុកោណ (ទំព័រ ១៦៩ - ១៨៦)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងមាត្រដ្ឋាន", "មេរៀនទី ១៤ ៖ ផ្ទៃក្រឡាពហុកោណ (ទំព័រ ១៨៧ - ១៩៦)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងមាត្រដ្ឋាន", "មេរៀនទី ១៥ ៖ រង្វង់ (ទំព័រ ១៩៧ - ២០៤)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងមាត្រដ្ឋាន", "មេរៀនទី ១៦ ៖ បន្ទាត់និងអង្កត់ពិសេសជួបគ្នានៅក្នុងត្រីកោណ (ទំព័រ ២០៥ - ២១៤)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងមាត្រដ្ឋាន", "មេរៀនទី ១៧ ៖ រូបធរណីមាត្រដែលមានវិមាត្របី (ទំព័រ ២១៥ - ២៣០)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងមាត្រដ្ឋាន", "មេរៀនទី ១៨ ៖ មាត្រដ្ឋាន (ទំព័រ ២៣១ - ២៣៦)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងមាត្រដ្ឋាន", "មេរៀនទី ១ ៖ ចំនួនអសនិទាន (ទំព័រ ១ - ១៦)": "ជំពូកទី ១ ៖ ចំនួន និងពីជគណិត", "មេរៀនទី ២ ៖ សមាមាត្រ (ទំព័រ ១៧ - ២៦)": "ជំពូកទី ១ ៖ ចំនួន និងពីជគណិត", "មេរៀនទី ៣ ៖ កន្សោមពីជគណិត (ទំព័រ ២៧ - ៤០)": "ជំពូកទី ១ ៖ ចំនួន និងពីជគណិត", "មេរៀនទី ៤ ៖ សមីការដឺក្រេទី១មានមួយអញ្ញាត (ទំព័រ ៤១ - ៥០)": "ជំពូកទី ១ ៖ ចំនួន និងពីជគណិត", "មេរៀនទី ៥ ៖ វិសមីការដឺក្រេទី១មានមួយអញ្ញាត (ទំព័រ ៥១ - ៦០)": "ជំពូកទី ១ ៖ ចំនួន និងពីជគណិត", "មេរៀនទី ៦ ៖ បំណែងចែកប្រេកង់ (ទំព័រ ៦១ - ៧៤)": "ជំពូកទី ២ ៖ ស្ថិតិ និងប្រូបាប", "មេរៀនទី ៧ ៖ មធ្យមស្ថិតិ (ទំព័រ ៧៥ - ៨៤)": "ជំពូកទី ២ ៖ ស្ថិតិ និងប្រូបាប", "មេរៀនទី ៨ ៖ ប្រូបាប (ទំព័រ ៨៥ - ៩៦)": "ជំពូកទី ២ ៖ ស្ថិតិ និងប្រូបាប", "មេរៀនទី ៩ ៖ ចម្ងាយរវាងពីរចំណុច (ទំព័រ ៩៧ - ១០៤)": "ជំពូកទី ៣ ៖ កូអរដោនេ និងបន្ទាត់", "មេរៀនទី ១០ ៖ សមីការនៃបន្ទាត់ (ទំព័រ ១០៥ - ១២០)": "ជំពូកទី ៣ ៖ កូអរដោនេ និងបន្ទាត់", "មេរៀនទី ១១ ៖ ប្រព័ន្ធសមីការដឺក្រេទី១មានពីរអញ្ញាត (ទំព័រ ១២១ - ១៣៤)": "ជំពូកទី ៣ ៖ កូអរដោនេ និងបន្ទាត់", "មេរៀនទី ១២ ៖ ទ្រឹស្ដីបទពីតាក័រ (ទំព័រ ១៣៥ - ១៤២)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងសូលីត", "មេរៀនទី ១៣ ៖ រង្វង់និងបន្ទាត់ (ទំព័រ ១៤៣ - ១៥៨)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងសូលីត", "មេរៀនទី ១៤ ៖ លក្ខណៈមុំនៃរង្វង់ (ទំព័រ ១៥៩ - ១៨០)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងសូលីត", "មេរៀនទី ១៥ ៖ ទ្រឹស្ដីបទតាឡែស (ទំព័រ ១៨១ - ១៩០)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងសូលីត", "មេរៀនទី ១៦ ៖ ត្រីកោណដូចគ្នា (ទំព័រ ១៩១ - ២១២)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងសូលីត", "មេរៀនទី ១៧ ៖ ពហុកោណ (ទំព័រ ២១៣ - ២២២)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងសូលីត", "មេរៀនទី ១៨ ៖ សូលីត (ទំព័រ ២២៣ - ២៣៥)": "ជំពូកទី ៤ ៖ ធរណីមាត្រ និងសូលីត", "មេរៀនទី ១ ៖ ពហុធា": "ជំពូកទី ១ ៖ ពហុធា", "មេរៀនទី ២ ៖ ប្រមាណវិធីចែកពហុធា": "ជំពូកទី ១ ៖ ពហុធា", "មេរៀនទី ១ ៖ តក្កវិទ្យា": "ជំពូកទី ២ ៖ តក្កវិទ្យា សំណុំ និងចំនួន", "មេរៀនទី ២ ៖ សំណុំ": "ជំពូកទី ២ ៖ តក្កវិទ្យា សំណុំ និងចំនួន", "មេរៀនទី ៣ ៖ ចំនួន": "ជំពូកទី ២ ៖ តក្កវិទ្យា សំណុំ និងចំនួន", "មេរៀនទី ១ ៖ សមីការដឺក្រេទី ២ មានមួយអថេរ": "ជំពូកទី ៣ ៖ សមីការនិងវិសមីការ", "មេរៀនទី ២ ៖ សមីការអសនិទាន និងសមីការដឺក្រេខ្ពស់": "ជំពូកទី ៣ ៖ សមីការនិងវិសមីការ", "មេរៀនទី ៣ ៖ ប្រព័ន្ធសមីការ": "ជំពូកទី ៣ ៖ សមីការនិងវិសមីការ", "មេរៀនទី ៤ ៖ វិសមីការ និងប្រព័ន្ធវិសមីការ": "ជំពូកទី ៣ ៖ សមីការនិងវិសមីការ", "មេរៀនទី ១ ៖ កូអរដោនេនៃចំណុច": "ជំពូកទី ៤ ៖ ធរណីមាត្រក្នុងប្លង់", "មេរៀនទី ២ ៖ សមីការបន្ទាត់": "ជំពូកទី ៤ ៖ ធរណីមាត្រក្នុងប្លង់", "មេរៀនទី ៣ ៖ សមីការរង្វង់": "ជំពូកទី ៤ ៖ ធរណីមាត្រក្នុងប្លង់", "មេរៀនទី ៤ ៖ ការដោះស្រាយវិសមីការតាមក្រាប": "ជំពូកទី ៤ ៖ ធរណីមាត្រក្នុងប្លង់", "មេរៀនទី ១ ៖ ផលធៀបត្រីកោណមាត្រ និងរង្វង់ត្រីកោណមាត្រ": "ជំពូកទី ៥ ៖ ផលធៀបត្រីកោណមាត្រ", "មេរៀនទី ២ ៖ ការអនុវត្តផលធៀបត្រីកោណមាត្រ": "ជំពូកទី ៥ ៖ ផលធៀបត្រីកោណមាត្រ", "មេរៀនទី ១ ៖ អនុគមន៍ និងក្រាបនៃអនុគមន៍": "ជំពូកទី ៦ ៖ អនុគមន៍", "មេរៀនទី ២ ៖ អនុគមន៍ដឺក្រេទី ២ (ប៉ារ៉ាបូល)": "ជំពូកទី ៦ ៖ អនុគមន៍", "មេរៀនទី ៣ ៖ អនុគមន៍សនិទាន និងអសនិទាន": "ជំពូកទី ៦ ៖ អនុគមន៍", "មេរៀនទី ១ ៖ បំណែងចែកប្រេកង់ និងការសង់ក្រាប": "ជំពូកទី ៧ ៖ ស្ថិតិ", "មេរៀនទី ២ ៖ រង្វាស់ទីតាំង": "ជំពូកទី ៧ ៖ ស្ថិតិ", "មេរៀនទី ១ ៖ វ៉ិចទ័រ និងប្រមាណវិធីលើវ៉ិចទ័រ (ផលគុណស្កាលែ)": "ជំពូកទី ៨ ៖ វ៉ិចទ័រក្នុងប្លង់", "មេរៀនទី ២ ៖ ការអនុវត្តវ៉ិចទ័រ": "ជំពូកទី ៨ ៖ វ៉ិចទ័រក្នុងប្លង់", "មេរៀនទី ១ ៖ ការបំប្លែងកិល": "ជំពូកទី ៩ ៖ ការបំប្លែងរូបក្នុងប្លង់", "មេរៀនទី ២ ៖ ការបំប្លែងឆ្លុះ": "ជំពូកទី ៩ ៖ ការបំប្លែងរូបក្នុងប្លង់", "មេរៀនទី ៣ ៖ ការបំប្លែងបង្វិល": "ជំពូកទី ៩ ៖ ការបំប្លែងរូបក្នុងប្លង់", "មេរៀនទី ៤ ៖ ការបំប្លែងចម្រើន (ឬការបំប្លែងដូច)": "ជំពូកទី ៩ ៖ ការបំប្លែងរូបក្នុងប្លង់", "មេរៀនទី ១ ៖ ស្វ៊ីតចំនួនពិត (ទំព័រ ១ - ៩)": "ជំពូកទី ១ ៖ ស្វ៊ីត", "មេរៀនទី ២ ៖ ស្វ៊ីតនព្វន្ត (ទំព័រ ១០ - ១៥)": "ជំពូកទី ១ ៖ ស្វ៊ីត", "មេរៀនទី ៣ ៖ ស្វ៊ីតធរណីមាត្រ (ទំព័រ ១៦ - ២៦)": "ជំពូកទី ១ ៖ ស្វ៊ីត", "មេរៀនទី ១ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល (ទំព័រ ២៧ - ៤៧)": "ជំពូកទី ២ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងអនុគមន៍លោការីត", "មេរៀនទី ២ ៖ អនុគមន៍លោការីត (ទំព័រ ៤៨ - ៦៦)": "ជំពូកទី ២ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងអនុគមន៍លោការីត", "មេរៀនទី ១ ៖ អនុគមន៍ត្រីកោណមាត្រ (ទំព័រ ៦៧ - ៨៧)": "ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ", "មេរៀនទី ២ ៖ រូបមន្តត្រីកោណមាត្រ (ទំព័រ ៨៨ - ៩៧)": "ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ", "មេរៀនទី ៣ ៖ សមីការ និងវិសមីការត្រីកោណមាត្រ (ទំព័រ ៩៨ - ១១២)": "ជំពូកទី ៣ ៖ អនុគមន៍ត្រីកោណមាត្រ", "មេរៀនទី ១ ៖ ម៉ាទ្រីស (ទំព័រ ១១៣ - ១២៩)": "ជំពូកទី ៤ ៖ ម៉ាទ្រីស និងដេទែរមីណង់", "មេរៀនទី ២ ៖ ដេទែរមីណង់ (ទំព័រ ១៣០ - ១៣៨)": "ជំពូកទី ៤ ៖ ម៉ាទ្រីស និងដេទែរមីណង់", "មេរៀនទី ១ ៖ លីមីតនៃអនុគមន៍ (ទំព័រ ១៣៩ - ១៤៨)": "ជំពូកទី ៥ ៖ លីមីត និងដេរីវេ", "មេរៀនទី ២ ៖ ដេរីវេនៃអនុគមន៍ (ទំព័រ ១៤៩ - ១៥៩)": "ជំពូកទី ៥ ៖ លីមីត និងដេរីវេ", "មេរៀនទី ៣ ៖ អនុវត្តន៍នៃដេរីវេ (ទំព័រ ១៦០ - ១៧៣)": "ជំពូកទី ៥ ៖ លីមីត និងដេរីវេ", "មេរៀនទី ៤ ៖ អថិរភាព និងក្រាបនៃអនុគមន៍ (ទំព័រ ១៧៤ - ១៩៦)": "ជំពូកទី ៥ ៖ លីមីត និងដេរីវេ", "មេរៀនទី ១ ៖ ប្រូបាប (ទំព័រ ១៩៧ - ២១៨)": "ជំពូកទី ៦ ៖ ប្រូបាប", "មេរៀនទី ១ ៖ ការបែងចែកទិន្នន័យជាភាគរយ (ទំព័រ ២១៩ - ២២៧)": "ជំពូកទី ៧ ៖ ស្ថិតិ", "មេរៀនទី ២ ៖ រង្វាស់នៃគម្លាត (ទំព័រ ២២៨ - ២៣៧)": "ជំពូកទី ៧ ៖ ស្ថិតិ", "មេរៀនទី ៣ ៖ គំនូសតាងបំណែងចែក និងបំណែងចែកណ័រម៉ាល់ (ទំព័រ ២៣៨ - ២៤៦)": "ជំពូកទី ៧ ៖ ស្ថិតិ", "មេរៀនទី ១ ៖ ផលបូកតួនៃស្វ៊ីតផ្សេងៗ (ទំព័រ ១ - ១៥)": "ជំពូកទី ១ ៖ ស្វ៊ីត និងអនុមានរួមគណិតវិទ្យា", "មេរៀនទី ២ ៖ ទំនាក់ទំនងតួនៃស្វ៊ីត (ទំព័រ ១៦ - ២៣)": "ជំពូកទី ១ ៖ ស្វ៊ីត និងអនុមានរួមគណិតវិទ្យា", "មេរៀនទី ៣ ៖ វិធានអនុមានរួមគណិតវិទ្យា (ទំព័រ ២៤ - ៣៤)": "ជំពូកទី ១ ៖ ស្វ៊ីត និងអនុមានរួមគណិតវិទ្យា", "មេរៀនទី ១ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល (ទំព័រ ៣៥ - ៤៥)": "ជំពូកទី ២ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងអនុគមន៍លោការីត", "មេរៀនទី ២ ៖ អនុគមន៍លោការីត (ទំព័រ ៤៦ - ៥៦)": "ជំពូកទី ២ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងអនុគមន៍លោការីត", "មេរៀនទី ១ ៖ សមីការ និងវិសមីការត្រីកោណមាត្រ (ទំព័រ ៥៧ - ៧២)": "ជំពូកទី ៣ ៖ សមីការ និងវិសមីការត្រីកោណមាត្រ", "មេរៀនទី ១ ៖ បំលែងលីនេអ៊ែរ (ទំព័រ ៧៣ - ១០២)": "ជំពូកទី ៤ ៖ បំលែងលីនេអ៊ែរ", "មេរៀនទី ១ ៖ អនុវត្តន៍ដេរីវេចំពោះសមីការ និងវិសមីការ (ទំព័រ ១០៣ - ១១៦)": "ជំពូកទី ៥ ៖ លីមីត និងដេរីវេ", "មេរៀនទី ១ ៖ ប្រូបាបមានលក្ខខណ្ឌ (ទំព័រ ១១៧ - ១៣៤)": "ជំពូកទី ៦ ៖ ប្រូបាប", "មេរៀនទី ១ ៖ ចំនួនកុំផ្លិចទម្រង់ពីជគណិត (ទំព័រ ១៣៥ - ១៤៣)": "ជំពូកទី ៧ ៖ ចំនួនកុំផ្លិច", "មេរៀនទី ២ ៖ ចំនួនកុំផ្លិចទម្រង់ត្រីកោណមាត្រ (ទំព័រ ១៤៤ - ១៦៣)": "ជំពូកទី ៧ ៖ ចំនួនកុំផ្លិច", "មេរៀនទី ៣ ៖ ស្វ័យគុណទី n និងឫសទី n នៃចំនួនកុំផ្លិច (ទំព័រ ១៦៤ - ១៧៣)": "ជំពូកទី ៧ ៖ ចំនួនកុំផ្លិច", "មេរៀនទី ៤ ៖ អនុវត្តន៍ចំនួនកុំផ្លិចក្នុងធរណីមាត្រ (ទំព័រ ១៧៤ - ១៨៨)": "ជំពូកទី ៧ ៖ ចំនួនកុំផ្លិច", "មេរៀនទី ១ ៖ វ៉ិចទ័រក្នុងលំហ (ទំព័រ ១៨៩ - ២១៥)": "ជំពូកទី ៨ ៖ វ៉ិចទ័រក្នុងលំហ", "មេរៀនទី ២ ៖ សមីការបន្ទាត់ និងសមីការប្លង់ក្នុងលំហ (ទំព័រ ២១៦ - ២៣៤)": "ជំពូកទី ៨ ៖ វ៉ិចទ័រក្នុងលំហ", "មេរៀនទី ១ ៖ ចំនួនកុំផ្លិចទម្រង់ពីជគណិត": "ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច", "មេរៀនទី ២ ៖ ចំនួនកុំផ្លិចទម្រង់ត្រីកោណមាត្រ": "ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច", "មេរៀនទី ៣ ៖ ស្វ័យគុណទី n និងឫសទី n នៃចំនួនកុំផ្លិច": "ជំពូកទី ១ ៖ ចំនួនកុំផ្លិច", "មេរៀនទី ១ ៖ លីមីតនៃអនុគមន៍": "ជំពូកទី ២ ៖ លីមីត", "មេរៀនទី ២ ៖ ភាពជាប់នៃអនុគមន៍": "ជំពូកទី ២ ៖ លីមីត", "មេរៀនទី ១ ៖ ដេរីវេ និងរូបមន្តដេរីវេ": "ជំពូកទី ៣ ៖ ដេរីវេ និងអនុវត្តន៍នៃដេរីវេ", "មេរៀនទី ២ ៖ អនុវត្តន៍ដេរីវេ និងបរមាធៀប": "ជំពូកទី ៣ ៖ ដេរីវេ និងអនុវត្តន៍នៃដេរីវេ", "មេរៀនទី ១ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល": "ជំពូកទី ៤ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងអនុគមន៍លោការីត", "មេរៀនទី ២ ៖ អនុគមន៍លោការីត": "ជំពូកទី ៤ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល និងអនុគមន៍លោការីត", "មេរៀនទី ១ ៖ ព្រីមីទីវ និងអាំងតេក្រាលមិនកំណត់": "ជំពូកទី ៥ ៖ ព្រីមីទីវ និងអាំងតេក្រាល", "មេរៀនទី ២ ៖ អាំងតេក្រាលកំណត់ និងការគណនាផ្ទៃក្រឡា": "ជំពូកទី ៥ ៖ ព្រីមីទីវ និងអាំងតេក្រាល", "មេរៀនទី ១ ៖ ការបែងចែកប្រេកង់ និងតារាងស្ថិតិ": "ជំពូកទី ៦ ៖ ស្ថិតិវិទ្យា", "មេរៀនទី ២ ៖ រង្វាស់ទីតាំងកណ្តាល និងរង្វាស់បំរែបំរួល": "ជំពូកទី ៦ ៖ ស្ថិតិវិទ្យា", "មេរៀនទី ១ ៖ គោលការណ៍រាប់ ចម្បាប់ និងបន្សំ": "ជំពូកទី ៧ ៖ ចម្បាប់ និងប្រូបាប", "មេរៀនទី ២ ៖ និយមន័យ និងការគណនាប្រូបាប": "ជំពូកទី ៧ ៖ ចម្បាប់ និងប្រូបាប", "មេរៀនទី ១ ៖ ដេរីវេនៃអនុគមន៍": "ជំពូកទី ៣ ៖ ដេរីវេនៃអនុគមន៍", "មេរៀនទី ២ ៖ អនុវត្តន៍នៃដេរីវេ": "ជំពូកទី ៣ ៖ ដេរីវេនៃអនុគមន៍", "មេរៀនទី ៣ ៖ អនុវត្តន៍ផ្សេងទៀតនៃដេរីវេ": "ជំពូកទី ៣ ៖ ដេរីវេនៃអនុគមន៍", "មេរៀនទី ១ ៖ អនុគមន៍សនិទាន": "ជំពូកទី ៤ ៖ សិក្សាអថេរភាពនិងសង់ក្រាប", "មេរៀនទី ២ ៖ អនុគមន៍អិចស្ប៉ូណង់ស្យែល": "ជំពូកទី ៤ ៖ សិក្សាអថេរភាពនិងសង់ក្រាប", "មេរៀនទី ៣ ៖ អនុគមន៍លោការីត": "ជំពូកទី ៤ ៖ សិក្សាអថេរភាពនិងសង់ក្រាប", "មេរៀនទី ១ ៖ វ៉ិចទ័រក្នុងលំហ": "ជំពូកទី ៥ ៖ វ៉ិចទ័រក្នុងលំហ", "មេរៀនទី ២ ៖ ផលគុណនៃពីរវ៉ិចទ័រក្នុងលំហ": "ជំពូកទី ៥ ៖ វ៉ិចទ័រក្នុងលំហ", "មេរៀនទី ៣ ៖ អនុវត្តន៍នៃផលគុណវ៉ិចទ័រ": "ជំពូកទី ៥ ៖ វ៉ិចទ័រក្នុងលំហ", "មេរៀនទី ១ ៖ ព្រីមីទីវនិងអាំងតេក្រាលមិនកំណត់": "ជំពូកទី ៦ ៖ អាំងតេក្រាល", "មេរៀនទី ២ ៖ អាំងតេក្រាលកំណត់": "ជំពូកទី ៦ ៖ អាំងតេក្រាល", "មេរៀនទី ៣ ៖ ផ្ទៃក្រឡានៃផ្ទៃប្លង់": "ជំពូកទី ៦ ៖ អាំងតេក្រាល", "មេរៀនទី ៤ ៖ មាឌសូលីតនិងប្រវែងធ្នូ": "ជំពូកទី ៦ ៖ អាំងតេក្រាល", "មេរៀនទី ១ ៖ សមីការឌីផេរ៉ង់ស្យែលលីនេអ៊ែរលំដាប់ទី 1": "ជំពូកទី ៧ ៖ សមីការឌីផេរ៉ង់ស្យែល", "មេរៀនទី ២ ៖ សមីការឌីផេរ៉ង់ស្យែលលីនេអ៊ែរលំដាប់ទី 2": "ជំពូកទី ៧ ៖ សមីការឌីផេរ៉ង់ស្យែល", "មេរៀនទី ១ ៖ ប្រូបាបមានលក្ខខណ្ឌ": "ជំពូកទី ៨ ៖ ប្រូបាប", "មេរៀនទី ២ ៖ ទ្រឹស្តីបទបេយេស": "ជំពូកទី ៨ ៖ ប្រូបាប", "មេរៀនទី ១ ៖ ស្ថិតិមានពីរអថេរ": "ជំពូកទី ៩ ៖ ស្ថិតិពីរអថេរ", "មេរៀនទី ២ ៖ សមីការបន្ទាត់តម្រែតម្រង់លីនេអ៊ែរ": "ជំពូកទី ៩ ៖ ស្ថិតិពីរអថេរ", "មេរៀនទី ១ ៖ ប៉ារ៉ាបូល": "ជំពូកទី ១០ ៖ កោនិក", "មេរៀនទី ២ ៖ អេលីប": "ជំពូកទី ១០ ៖ កោនិក", "មេរៀនទី ៣ ៖ អ៊ីពែបូល": "ជំពូកទី ១០ ៖ កោនិក"};

/**
 * NGS Question Bank (ធនាគារសំណួរ 5,470 សំណួរ)
 * Inspired by & Modeled after KhmerMath Exam (exam.khmermath.org/teacher)
 * Designed for Teacher Nuon Bonorng (Bonorng11) - New Generation School
 */

class QuestionBankController {
  constructor() {
    this.selectedGrade = 'all';
    this.selectedLesson = 'all';
    this.selectedLevel = 'all';
    this.selectedKind = 'all';
    this.searchQuery = '';
    this.selectedIds = new Set();
    this.currentPage = 1;
    this.pageSize = 15;
    this.customQuestions = this.loadCustomQuestions();
    this.isInitialized = false;
  }

  loadCustomQuestions() {
    try {
      return JSON.parse(localStorage.getItem('ngs_custom_questions') || '[]');
    } catch (e) {
      return [];
    }
  }

  saveCustomQuestions() {
    try {
      localStorage.setItem('ngs_custom_questions', JSON.stringify(this.customQuestions));
    } catch (e) {}
  }

  formatMath(text) {
    if (!text) return '';
    if (typeof katex === 'undefined') return text;
    return text.replace(/\$([^\$]+)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { throwOnError: false, displayMode: false });
      } catch (e) {
        return formula;
      }
    });
  }

  getAllQuestions() {
    const base = (window.MATH_DATABASE && window.MATH_DATABASE.questions) || [];
    const custom = this.customQuestions || [];
    
    // Tag each question with chapter and stable id
    const all = [...custom, ...base].map((q, idx) => {
      const chap = BANK_CHAPTER_MAP[q.l] || 'ជំពូកទូទៅ';
      const id = q.id || `q_${idx + 1}`;
      
      let level = q.level;
      if (!level) {
        if (q.p && (q.p.includes('លំហាត់ពិបាក') || q.p.includes('កម្រិតខ្ពស់'))) level = 'ពិបាក';
        else if (q.p && (q.p.includes('PISA') || q.p.includes('ការអនុវត្ត'))) level = 'បែប PISA';
        else if (idx % 3 === 0) level = 'ងាយ';
        else if (idx % 3 === 1) level = 'មធ្យម';
        else level = 'ពិបាក';
      }

      return {
        ...q,
        id,
        ch: q.ch || chap,
        level,
        kind: q.kind || 'mcq'
      };
    });

    return all;
  }

  getGradeCounts() {
    const all = this.getAllQuestions();
    const counts = {
      all: all.length,
      'NGS': 0,
      'ថ្នាក់ទី ៧': 0,
      'ថ្នាក់ទី ៨': 0,
      'ថ្នាក់ទី ៩': 0,
      'ថ្នាក់ទី ១០': 0,
      '11SC': 0,
      '11SS': 0,
      '12SC': 0,
      '12SS': 0
    };

    all.forEach((q, idx) => {
      if (idx < 126 || q.g === 'NGS') counts['NGS']++;
      if (q.g === 'ថ្នាក់ទី ៧') counts['ថ្នាក់ទី ៧']++;
      else if (q.g === 'ថ្នាក់ទី ៨') counts['ថ្នាក់ទី ៨']++;
      else if (q.g === 'ថ្នាក់ទី ៩') counts['ថ្នាក់ទី ៩']++;
      else if (q.g === 'ថ្នាក់ទី ១០') counts['ថ្នាក់ទី ១០']++;
      else if (q.g === 'ថ្នាក់ទី ១១') {
        if (q.stream && q.stream.includes('កម្រិតខ្ពស់')) counts['11SC']++;
        else counts['11SS']++;
      } else if (q.g === 'ថ្នាក់ទី ១២') {
        if (q.stream && q.stream.includes('កម្រិតខ្ពស់')) counts['12SC']++;
        else counts['12SS']++;
      }
    });

    return counts;
  }

  getFilteredQuestions() {
    let list = this.getAllQuestions();

    // Grade filter
    if (this.selectedGrade && this.selectedGrade !== 'all') {
      if (this.selectedGrade === 'NGS') {
        list = list.slice(0, 126);
      } else if (this.selectedGrade === '11SC') {
        list = list.filter(q => q.g === 'ថ្នាក់ទី ១១' && q.stream && q.stream.includes('កម្រិតខ្ពស់'));
      } else if (this.selectedGrade === '11SS') {
        list = list.filter(q => q.g === 'ថ្នាក់ទី ១១' && q.stream && q.stream.includes('មូលដ្ឋាន'));
      } else if (this.selectedGrade === '12SC') {
        list = list.filter(q => q.g === 'ថ្នាក់ទី ១២' && q.stream && q.stream.includes('កម្រិតខ្ពស់'));
      } else if (this.selectedGrade === '12SS') {
        list = list.filter(q => q.g === 'ថ្នាក់ទី ១២' && q.stream && q.stream.includes('មូលដ្ឋាន'));
      } else if (this.selectedGrade === 'ថ្នាក់ទី ១១') {
        list = list.filter(q => q.g === 'ថ្នាក់ទី ១១');
      } else if (this.selectedGrade === 'ថ្នាក់ទី ១២') {
        list = list.filter(q => q.g === 'ថ្នាក់ទី ១២');
      } else {
        list = list.filter(q => q.g === this.selectedGrade);
      }
    }

    // Lesson or Chapter filter
    if (this.selectedLesson && this.selectedLesson !== 'all') {
      if (this.selectedLesson.startsWith('chapter:')) {
        const chId = this.selectedLesson.replace('chapter:', '');
        list = list.filter(q => q.chId === chId || q.ch === chId);
      } else {
        list = list.filter(q => q.lesId === this.selectedLesson || q.l === this.selectedLesson);
      }
    }

    // Level filter
    if (this.selectedLevel && this.selectedLevel !== 'all') {
      list = list.filter(q => q.level === this.selectedLevel);
    }

    // Search query
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const qLower = this.searchQuery.toLowerCase().trim();
      list = list.filter(q => 
        (q.q && q.q.toLowerCase().includes(qLower)) ||
        (q.l && q.l.toLowerCase().includes(qLower)) ||
        (q.ch && q.ch.toLowerCase().includes(qLower)) ||
        (q.p && q.p.toLowerCase().includes(qLower)) ||
        (q.e && q.e.toLowerCase().includes(qLower)) ||
        (q.o && q.o.some(opt => opt && opt.toLowerCase().includes(qLower)))
      );
    }

    return list;
  }

  init() {
    this.renderGradeChips();
    this.renderLessonDropdown();
    this.renderQuestions();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  setupEventListeners() {
    // Grade select dropdown
    const gradeSelect = document.getElementById('bankSelectGrade');
    if (gradeSelect) {
      gradeSelect.value = this.selectedGrade;
      gradeSelect.onchange = (e) => {
        this.selectGrade(e.target.value);
      };
    }

    // Lesson select dropdown
    const lessonSelect = document.getElementById('bankSelectLesson');
    if (lessonSelect) {
      lessonSelect.onchange = (e) => {
        this.selectedLesson = e.target.value;
        this.currentPage = 1;
        this.renderQuestions();
      };
    }

    // Level select dropdown
    const levelSelect = document.getElementById('bankSelectLevel');
    if (levelSelect) {
      levelSelect.onchange = (e) => {
        this.selectedLevel = e.target.value;
        this.currentPage = 1;
        this.renderQuestions();
      };
    }

    // Search input
    const searchInput = document.getElementById('bankSearchInput');
    if (searchInput) {
      let debounceTimer = null;
      searchInput.oninput = (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.searchQuery = e.target.value;
          this.currentPage = 1;
          this.renderQuestions();
        }, 250);
      };
    }

    // Select all visible checkbox
    const selectAllCb = document.getElementById('bankSelectAllVisible');
    if (selectAllCb) {
      selectAllCb.onchange = (e) => {
        this.toggleSelectAllVisible(e.target.checked);
      };
    }
  }

  selectGrade(grade) {
    this.selectedGrade = grade;
    this.selectedLesson = 'all';
    this.currentPage = 1;

    // Update grade dropdown value
    const gradeSelect = document.getElementById('bankSelectGrade');
    if (gradeSelect) gradeSelect.value = grade;

    this.renderGradeChips();
    this.renderLessonDropdown();
    this.renderQuestions();
  }

  renderGradeChips() {
    const container = document.getElementById('bankGradeChips');
    if (!container) return;

    const counts = this.getGradeCounts();
    const chipsData = [
      { id: 'all', label: 'ទាំងអស់', count: counts.all },
      { id: 'NGS', label: 'តម្រង់ទិសសិស្ស NGS ២០២៦-២០២៧', count: counts['NGS'] },
      { id: 'ថ្នាក់ទី ៧', label: 'ថ្នាក់ទី ៧', count: counts['ថ្នាក់ទី ៧'] },
      { id: 'ថ្នាក់ទី ៨', label: 'ថ្នាក់ទី ៨', count: counts['ថ្នាក់ទី ៨'] },
      { id: 'ថ្នាក់ទី ៩', label: 'ថ្នាក់ទី ៩', count: counts['ថ្នាក់ទី ៩'] },
      { id: 'ថ្នាក់ទី ១០', label: 'ថ្នាក់ទី ១០', count: counts['ថ្នាក់ទី ១០'] },
      { id: '11SC', label: 'ថ្នាក់ទី ១១ (វិទ្យាសាស្ត្រពិត)', count: counts['11SC'] },
      { id: '11SS', label: 'ថ្នាក់ទី ១១ (វិទ្យាសាស្ត្រសង្គម)', count: counts['11SS'] },
      { id: '12SC', label: 'ថ្នាក់ទី ១២ (វិទ្យាសាស្ត្រពិត)', count: counts['12SC'] },
      { id: '12SS', label: 'ថ្នាក់ទី ១២ (វិទ្យាសាស្ត្រសង្គម)', count: counts['12SS'] }
    ];

    container.innerHTML = chipsData.map(chip => {
      const isActive = this.selectedGrade === chip.id;
      return `
        <button type="button" onclick="window.questionBank.selectGrade('${chip.id}')" 
          class="px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
            isActive 
              ? 'bg-blue-600 text-white shadow-blue-500/30' 
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
          }">
          <span>${chip.label}</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] ${
            isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          } font-mono">
            ${chip.count}
          </span>
        </button>
      `;
    }).join('');

    const totalBadge = document.getElementById('bankTotalCountBadge');
    if (totalBadge) totalBadge.textContent = `(${counts.all.toLocaleString()})`;
  }

  renderLessonDropdown() {
    const lessonSelect = document.getElementById('bankSelectLesson');
    if (!lessonSelect) return;

    if (!window.MATH_DATABASE || !window.MATH_DATABASE.chaptersByGrade) {
      lessonSelect.innerHTML = `<option value="all">📚 គ្រប់ជំពូក និងមេរៀនទាំងអស់</option>`;
      return;
    }

    const gKey = (this.selectedGrade === '11SC' || this.selectedGrade === '11SS') ? 'ថ្នាក់ទី ១១' :
                 (this.selectedGrade === '12SC' || this.selectedGrade === '12SS') ? 'ថ្នាក់ទី ១២' : this.selectedGrade;

    let optionsHtml = `<option value="all">📚 គ្រប់ជំពូក និងមេរៀនទាំងអស់</option>`;

    if (gKey === 'all' || gKey === 'NGS') {
      Object.entries(window.MATH_DATABASE.chaptersByGrade).forEach(([gradeName, chapters]) => {
        chapters.forEach(ch => {
          const streamBadge = ch.stream ? ` (${ch.stream})` : '';
          optionsHtml += `<optgroup label="${gradeName} ➔ ${ch.title}${streamBadge}">`;
          optionsHtml += `<option value="chapter:${ch.id}" ${this.selectedLesson === 'chapter:' + ch.id ? 'selected' : ''}>📖 ជំពូកទាំងមូល ៖ ${ch.title}</option>`;
          ch.lessons.forEach(les => {
            const countText = les.questionCount ? ` (${les.questionCount} សំណួរ)` : '';
            optionsHtml += `<option value="${les.id}" ${this.selectedLesson === les.id ? 'selected' : ''}>${les.title}${countText}</option>`;
          });
          optionsHtml += `</optgroup>`;
        });
      });
    } else {
      let chapters = window.MATH_DATABASE.chaptersByGrade[gKey] || [];
      if (this.selectedGrade === '11SC' || this.selectedGrade === '12SC') {
        chapters = chapters.filter(ch => ch.stream && ch.stream.includes('កម្រិតខ្ពស់'));
      } else if (this.selectedGrade === '11SS' || this.selectedGrade === '12SS') {
        chapters = chapters.filter(ch => ch.stream && ch.stream.includes('មូលដ្ឋាន'));
      }
      chapters.forEach(ch => {
        const streamBadge = ch.stream ? ` (${ch.stream})` : '';
        optionsHtml += `<optgroup label="${ch.title}${streamBadge}">`;
        optionsHtml += `<option value="chapter:${ch.id}" ${this.selectedLesson === 'chapter:' + ch.id ? 'selected' : ''}>📖 ជំពូកទាំងមូល ៖ ${ch.title}</option>`;
        ch.lessons.forEach(les => {
          const countText = les.questionCount ? ` (${les.questionCount} សំណួរ)` : '';
          optionsHtml += `<option value="${les.id}" ${this.selectedLesson === les.id ? 'selected' : ''}>${les.title}${countText}</option>`;
        });
        optionsHtml += `</optgroup>`;
      });
    }

    lessonSelect.innerHTML = optionsHtml;
  }

  renderQuestions() {
    const container = document.getElementById('bankQuestionsContainer');
    const countLabel = document.getElementById('bankFilterCountLabel');
    if (!container) return;

    const filtered = this.getFilteredQuestions();
    const totalFiltered = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / this.pageSize));

    if (this.currentPage > totalPages) this.currentPage = totalPages;

    const startIdx = (this.currentPage - 1) * this.pageSize;
    const endIdx = Math.min(startIdx + this.pageSize, totalFiltered);
    const pageQuestions = filtered.slice(startIdx, endIdx);

    if (countLabel) {
      countLabel.textContent = `(បង្ហាញ ${pageQuestions.length} នៃ ${totalFiltered.toLocaleString()} សំណួរ)`;
    }

    if (pageQuestions.length === 0) {
      container.innerHTML = `
        <div class="card-soft p-12 text-center text-slate-400 space-y-3">
          <div class="text-5xl">🔍</div>
          <h4 class="font-bold text-base text-slate-600 dark:text-slate-300">មិនមានសំណួរត្រូវនឹងលក្ខខណ្ឌស្វែងរកនេះទេ</h4>
          <p class="text-xs">សូមផ្លាស់ប្តូរកម្រិតថ្នាក់ មេរៀន ឬពាក្យគន្លឹះស្វែងរកឡើងវិញ</p>
          <button onclick="window.questionBank.selectGrade('all')" class="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow">
            ត្រឡប់ទៅមើលសំណួរទាំងអស់
          </button>
        </div>
      `;
      this.renderPagination(0, 0, 0);
      return;
    }

    container.innerHTML = pageQuestions.map((q, idx) => {
      const globalIdx = startIdx + idx;
      const isSelected = this.selectedIds.has(q.id);

      const levelColor = q.level === 'ងាយ' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' :
                         q.level === 'មធ្យម' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' :
                         q.level === 'បែប PISA' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                         'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300';

      return `
        <div class="card-soft p-5 border-2 transition hover:shadow-md ${
          isSelected 
            ? 'border-purple-500 bg-purple-50/20 dark:bg-purple-950/20' 
            : 'border-slate-100 dark:border-slate-700/80 hover:border-purple-300'
        }">
          <!-- Top metadata row -->
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div class="flex flex-wrap items-center gap-2">
              <input type="checkbox" class="bank-q-checkbox w-4 h-4 rounded text-purple-600 cursor-pointer" 
                data-id="${q.id}" ${isSelected ? 'checked' : ''}
                onchange="window.questionBank.toggleSelect('${q.id}', this.checked)">
              <span class="font-mono font-bold text-xs text-purple-600 dark:text-purple-400">#${globalIdx + 1}</span>
              <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">${q.g}</span>
              <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 truncate max-w-[200px]" title="${q.ch || ''}">${q.ch || 'ជំពូកទូទៅ'}</span>
              <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 truncate max-w-[220px]" title="${q.l || ''}">${q.l}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${levelColor}">${q.level || 'មធ្យម'}</span>
              <button onclick="window.questionBank.copyQuestionText('${q.id}')" title="ចម្លងសំណួរ" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-purple-600 transition">
                <i class="fa-regular fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- Question content -->
          <div class="text-slate-900 dark:text-white font-medium text-sm md:text-base leading-relaxed mb-4">
            ${this.formatMath(q.q)}
          </div>

          <!-- Options -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            ${q.o.map((opt, oIdx) => `
              <div class="p-2.5 rounded-xl border transition ${
                oIdx === q.a 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-400' 
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              } text-xs flex items-center gap-2.5">
                <span class="w-6 h-6 rounded-lg ${
                  oIdx === q.a 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                } font-black text-xs flex items-center justify-center shrink-0">
                  ${String.fromCharCode(65 + oIdx)}
                </span>
                <span class="flex-1">${this.formatMath(opt)}</span>
                ${oIdx === q.a ? '<i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i>' : ''}
              </div>
            `).join('')}
          </div>

          <!-- Solution / Explanation -->
          ${q.e ? `
            <div class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <details class="group text-xs text-slate-500 dark:text-slate-400">
                <summary class="cursor-pointer font-bold hover:text-purple-600 flex items-center gap-1.5 select-none">
                  <i class="fa-solid fa-lightbulb text-amber-500"></i>
                  <span>បង្ហាញគន្លឹះដោះស្រាយ (Solution & Explanation)</span>
                </summary>
                <div class="mt-2 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-slate-800 dark:text-slate-200 leading-relaxed">
                  ${this.formatMath(q.e)}
                </div>
              </details>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    this.renderPagination(this.currentPage, totalPages, totalFiltered);
    this.updateSelectionUI();
  }

  renderPagination(page, totalPages, totalCount) {
    const infoEl = document.getElementById('bankPaginationInfo');
    const ctrlEl = document.getElementById('bankPaginationControls');
    if (!ctrlEl) return;

    if (totalCount === 0) {
      if (infoEl) infoEl.textContent = 'មិនមានសំណួរ';
      ctrlEl.innerHTML = '';
      return;
    }

    if (infoEl) {
      infoEl.textContent = `ទំព័រ ${page} នៃ ${totalPages} (${totalCount.toLocaleString()} សំណួរ)`;
    }

    let btns = [];

    // Prev Button
    btns.push(`
      <button onclick="window.questionBank.goToPage(${page - 1})" ${page <= 1 ? 'disabled' : ''}
        class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition">
        <i class="fa-solid fa-chevron-left"></i> ថយ
      </button>
    `);

    // Page number buttons
    const startP = Math.max(1, page - 2);
    const endP = Math.min(totalPages, page + 2);

    if (startP > 1) {
      btns.push(`<button onclick="window.questionBank.goToPage(1)" class="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold">1</button>`);
      if (startP > 2) btns.push(`<span class="px-1 text-slate-400">...</span>`);
    }

    for (let p = startP; p <= endP; p++) {
      const isCurrent = p === page;
      btns.push(`
        <button onclick="window.questionBank.goToPage(${p})" 
          class="px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            isCurrent 
              ? 'bg-purple-600 text-white shadow-sm' 
              : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
          }">
          ${p}
        </button>
      `);
    }

    if (endP < totalPages) {
      if (endP < totalPages - 1) btns.push(`<span class="px-1 text-slate-400">...</span>`);
      btns.push(`<button onclick="window.questionBank.goToPage(${totalPages})" class="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold">${totalPages}</button>`);
    }

    // Next Button
    btns.push(`
      <button onclick="window.questionBank.goToPage(${page + 1})" ${page >= totalPages ? 'disabled' : ''}
        class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition">
        បន្ទាប់ <i class="fa-solid fa-chevron-right"></i>
      </button>
    `);

    ctrlEl.innerHTML = btns.join('');
  }

  goToPage(p) {
    this.currentPage = p;
    this.renderQuestions();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  toggleSelect(id, checked) {
    if (checked) this.selectedIds.add(id);
    else this.selectedIds.delete(id);
    this.updateSelectionUI();
  }

  toggleSelectAllVisible(checked) {
    const filtered = this.getFilteredQuestions();
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const endIdx = Math.min(startIdx + this.pageSize, filtered.length);
    const pageQuestions = filtered.slice(startIdx, endIdx);

    pageQuestions.forEach(q => {
      if (checked) this.selectedIds.add(q.id);
      else this.selectedIds.delete(q.id);
    });

    document.querySelectorAll('.bank-q-checkbox').forEach(cb => {
      cb.checked = checked;
    });

    this.updateSelectionUI();
  }

  updateSelectionUI() {
    const count = this.selectedIds.size;
    const badge = document.getElementById('bankSelectedCountBadge');
    const btnExport = document.getElementById('btnBankExportSelected');
    const btnCount = document.getElementById('bankSelectedBtnCount');
    const btnClear = document.getElementById('btnBankClearSelected');

    if (badge) {
      badge.textContent = `បានជ្រើសរើស: ${count} សំណួរ`;
      if (count > 0) badge.classList.remove('hidden');
      else badge.classList.add('hidden');
    }

    if (btnCount) btnCount.textContent = count;
    if (btnExport) btnExport.disabled = count === 0;

    if (btnClear) {
      if (count > 0) btnClear.classList.remove('hidden');
      else btnClear.classList.add('hidden');
    }
  }

  clearSelection() {
    this.selectedIds.clear();
    const cbAll = document.getElementById('bankSelectAllVisible');
    if (cbAll) cbAll.checked = false;
    document.querySelectorAll('.bank-q-checkbox').forEach(cb => cb.checked = false);
    this.updateSelectionUI();
  }

  copyQuestionText(id) {
    const all = this.getAllQuestions();
    const q = all.find(item => item.id === id);
    if (!q) return;

    const text = `${q.q}\n` + q.o.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n') + 
                 `\nចម្លើយត្រឹមត្រូវ៖ ${String.fromCharCode(65 + q.a)}\n` + 
                 (q.e ? `គន្លឹះដោះស្រាយ៖ ${q.e}` : '');

    navigator.clipboard.writeText(text).then(() => {
      if (typeof window.showToast === 'function') {
        window.showToast('✅ បានចម្លងសំណួររួចរាល់!');
      } else {
        window.showToast('✅ បានចម្លងសំណួររួចរាល់!');
      }
    });
  }

  /* ================== RANDOM TEST GENERATOR ================== */
  openRandomTestModal() {
    window.showStandardDialog({
      title: '🎲 បង្កើតតេស្តចៃដន្យពីធនាគារ (Random Test)',
      html: `
        <div class="py-2 text-left space-y-4">
          <p class="text-xs text-slate-500">ជ្រើសរើសកម្រិតថ្នាក់ មេរៀន និងចំនួនសំណួរ ដើម្បីបង្កើតកិច្ចការតេស្តភ្លាមៗ៖</p>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ចំណងជើងតេស្ត / សន្លឹកកិច្ចការ</label>
            <input id="randomTestTitle" type="text" value="កិច្ចការតេស្តគណិតវិទ្យា NGS" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">កម្រិតថ្នាក់</label>
              <select id="randomTestGrade" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
                <option value="all">គ្រប់កម្រិតថ្នាក់</option>
                <option value="ថ្នាក់ទី ៧">ថ្នាក់ទី ៧</option>
                <option value="ថ្នាក់ទី ៨" selected>ថ្នាក់ទី ៨</option>
                <option value="ថ្នាក់ទី ៩">ថ្នាក់ទី ៩</option>
                <option value="ថ្នាក់ទី ៩">ថ្នាក់ទី ៩</option>
                <option value="ថ្នាក់ទី ១០">ថ្នាក់ទី ១០</option>
                <option value="ថ្នាក់ទី ១១">ថ្នាក់ទី ១១</option>
                <option value="ថ្នាក់ទី ១២">ថ្នាក់ទី ១២</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ចំនួនសំណួរ</label>
              <select id="randomTestCount" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-purple-600">
                <option value="5">៥ សំណួរ (រហ័ស)</option>
                <option value="10" selected>១០ សំណួរ (ស្តង់ដា)</option>
                <option value="15">១៥ សំណួរ</option>
                <option value="20">២០ សំណួរ</option>
                <option value="25">២៥ សំណួរ</option>
                <option value="30">៣០ សំណួរ</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-1">
            <input type="checkbox" id="randomTestIncludeKey" class="w-4 h-4 rounded text-purple-600" checked>
            <label for="randomTestIncludeKey" class="text-xs text-slate-600 dark:text-slate-300 font-bold cursor-pointer">
              រួមបញ្ចូលសន្លឹកចម្លើយ និងដំណោះស្រាយ (Answer Key)
            </label>
          </div>
        </div>
      `,
      icon: 'info',
      confirmText: '🎲 បង្កើតតេស្ត & បោះពុម្ព',
      onConfirm: () => {
        const title = document.getElementById('randomTestTitle')?.value || 'កិច្ចការតេស្តគណិតវិទ្យា';
        const grade = document.getElementById('randomTestGrade')?.value || 'all';
        const count = parseInt(document.getElementById('randomTestCount')?.value || '10', 10);
        const includeKey = document.getElementById('randomTestIncludeKey')?.checked ?? true;

        let pool = this.getAllQuestions();
        if (grade !== 'all') pool = pool.filter(q => q.g === grade);
        pool = [...pool].sort(() => Math.random() - 0.5);

        const picked = pool.slice(0, count);
        this.openPrintPreview(title, picked, includeKey);
      }
    });
  }

  /* ================== EXPORT & PRINT PAPER ================== */
  exportSelectedQuestions() {
    const all = this.getAllQuestions();
    const picked = all.filter(q => this.selectedIds.has(q.id));
    if (picked.length === 0) {
      window.showStandardDialog({ title: '⚠️ សូមជ្រើសរើសសំណួរ', text: 'សូមជ្រើសរើសសំណួរយ៉ាងតិច ១ ជាមុនសិន!', icon: 'warning' });
      return;
    }
    this.openPrintPreview('កិច្ចការតេស្តគណិតវិទ្យា NGS (សំណួរដែលបានជ្រើស)', picked, true);
  }

  openExportModal() {
    this.openRandomTestModal();
  }

  openPrintPreview(title, questionsList, includeKey = true) {
    const modalBack = document.createElement('div');
    modalBack.id = 'printPaperModalBack';
    modalBack.className = 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 overflow-y-auto flex items-start justify-center p-4 md:p-8';

    const modalBox = document.createElement('div');
    modalBox.className = 'w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-4';

    modalBox.innerHTML = `
      <!-- Toolbar (Hidden on Print) -->
      <div class="no-print p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-file-pdf text-red-600 text-xl"></i>
          <div>
            <h4 class="font-bold text-sm text-slate-800">${title}</h4>
            <span class="text-xs text-slate-500">${questionsList.length} សំណួរ • ត្រៀមបោះពុម្ព ឬ Save as PDF</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow flex items-center gap-2">
            <i class="fa-solid fa-print"></i>
            <span>បោះពុម្ព / Save as PDF</span>
          </button>
          <button onclick="document.getElementById('printPaperModalBack').remove()" class="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs">
            បិទ
          </button>
        </div>
      </div>

      <!-- Printable Exam Paper Document -->
      <div id="printableExamDoc" class="p-8 md:p-12 space-y-6 bg-white font-battambang">
        <!-- Kingdom & School Header -->
        <div class="flex justify-between items-start border-b-2 border-slate-900 pb-4 text-center">
          <div class="text-left space-y-1">
            <p class="font-moul text-xs">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
            <p class="font-bold text-xs text-purple-900">សាលារៀនជំនាន់ថ្មី (New Generation School)</p>
            <p class="text-xs">វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី</p>
            <p class="text-xs text-slate-600">គ្រូបង្រៀន៖ <strong>នួន បូណង (Bonorng11)</strong></p>
          </div>
          <div class="text-center space-y-0.5">
            <p class="font-moul text-xs">ព្រះរាជាណាចក្រកម្ពុជា</p>
            <p class="font-moul text-xs">ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
            <div class="text-lg">☸ ☸ ☸</div>
          </div>
        </div>

        <!-- Exam Title & Student Info Lines -->
        <div class="text-center space-y-2 py-2">
          <h2 class="font-moul text-base md:text-lg text-slate-900">${title}</h2>
          <div class="flex justify-between items-center text-xs pt-2">
            <div>ឈ្មោះសិស្ស៖ .............................................................</div>
            <div>ថ្នាក់ទី៖ .............</div>
            <div>កាលបរិច្ឆេទ៖ ..... / ..... / ២០២៦</div>
          </div>
          <div class="flex justify-between items-center text-xs text-slate-600 border-t border-dashed border-slate-300 pt-2">
            <div>មុខវិជ្ជា៖ <strong>គណិតវិទ្យា</strong></div>
            <div>រយៈពេល៖ <strong>៦០ នាទី</strong></div>
            <div>ពិន្ទុសរុប៖ <strong>${questionsList.length * 2} ពិន្ទុ</strong></div>
          </div>
        </div>

        <!-- Questions List -->
        <div class="space-y-6 pt-2">
          ${questionsList.map((q, idx) => `
            <div class="space-y-2.5 break-inside-avoid">
              <div class="font-bold text-sm leading-relaxed flex items-start gap-2">
                <span class="font-mono text-purple-700 shrink-0">សំណួរទី ${idx + 1}៖</span>
                <span class="flex-1">${this.formatMath(q.q)}</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pl-6 text-xs">
                ${q.o.map((opt, oIdx) => `
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-slate-700">(${String.fromCharCode(65 + oIdx)})</span>
                    <span>${this.formatMath(opt)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Optional Answer Key Sheet -->
        ${includeKey ? `
          <div class="mt-12 pt-6 border-t-2 border-slate-900 break-before-page">
            <h3 class="font-moul text-sm text-center mb-4 text-purple-900">សន្លឹកចម្លើយ និងដំណោះស្រាយ (Teacher's Answer Key)</h3>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs mb-6">
              ${questionsList.map((q, idx) => `
                <div class="p-2 border border-slate-300 rounded-lg text-center bg-slate-50">
                  <span class="font-bold">លំហាត់ ${idx + 1}៖</span> 
                  <strong class="text-purple-700 text-sm">(${String.fromCharCode(65 + q.a)})</strong>
                </div>
              `).join('')}
            </div>

            <!-- Detailed Solutions -->
            <div class="space-y-3 pt-2">
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-500">គន្លឹះដោះស្រាយលម្អិត៖</h4>
              ${questionsList.filter(q => q.e).map((q, idx) => `
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed">
                  <strong>លំហាត់ទី ${idx + 1}៖</strong> ${this.formatMath(q.e)}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    modalBack.appendChild(modalBox);
    document.body.appendChild(modalBack);
  }

  /* ================== ADD CUSTOM QUESTION ================== */
  openAddQuestionModal() {
    window.showStandardDialog({
      title: '➕ បន្ថែមសំណួរគណិតវិទ្យាថ្មី',
      html: `
        <div class="py-2 text-left space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">កម្រិតថ្នាក់</label>
              <select id="newQGrade" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
                <option value="ថ្នាក់ទី ៧">ថ្នាក់ទី ៧</option>
                <option value="ថ្នាក់ទី ៨" selected>ថ្នាក់ទី ៨</option>
                <option value="ថ្នាក់ទី ៩">ថ្នាក់ទី ៩</option>
                <option value="ថ្នាក់ទី ១០">ថ្នាក់ទី ១០</option>
                <option value="ថ្នាក់ទី ១១">ថ្នាក់ទី ១១</option>
                <option value="ថ្នាក់ទី ១២">ថ្នាក់ទី ១២</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">កម្រិតពិបាក</label>
              <select id="newQLevel" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
                <option value="ងាយ">ងាយ</option>
                <option value="មធ្យម" selected>មធ្យម</option>
                <option value="ពិបាក">ពិបាក</option>
                <option value="បែប PISA">បែប PISA</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ឈ្មោះមេរៀន / ជំពូក</label>
            <input id="newQLesson" type="text" placeholder="ឧ. មេរៀនទី ១ ៖ ចំនួនសនិទាន" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ខ្លឹមសារសំណួរ (អាចវាយ LaTeX ក្នុង $...$)</label>
            <textarea id="newQText" rows="2" placeholder="ឧ. គណនាតម្លៃនៃ $ x^2 - 4 = 0 $" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"></textarea>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">ជម្រើសចម្លើយទាំង ៤ (A, B, C, D)</label>
            <div class="grid grid-cols-2 gap-2">
              <input id="newQOpt0" type="text" placeholder="ជម្រើស A" class="px-2.5 py-1.5 rounded-lg border text-xs">
              <input id="newQOpt1" type="text" placeholder="ជម្រើស B" class="px-2.5 py-1.5 rounded-lg border text-xs">
              <input id="newQOpt2" type="text" placeholder="ជម្រើស C" class="px-2.5 py-1.5 rounded-lg border text-xs">
              <input id="newQOpt3" type="text" placeholder="ជម្រើស D" class="px-2.5 py-1.5 rounded-lg border text-xs">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ចម្លើយដែលត្រឹមត្រូវ</label>
            <select id="newQCorrect" class="w-full px-3 py-1.5 rounded-xl border text-xs font-bold text-emerald-600">
              <option value="0">ចម្លើយ A</option>
              <option value="1">ចម្លើយ B</option>
              <option value="2">ចម្លើយ C</option>
              <option value="3">ចម្លើយ D</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">គន្លឹះដោះស្រាយ (Explanation)</label>
            <textarea id="newQExp" rows="2" placeholder="ពន្យល់របៀបដោះស្រាយ..." class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"></textarea>
          </div>
        </div>
      `,
      icon: 'question',
      confirmText: '💾 រក្សាទុកសំណួរ',
      onConfirm: () => {
        const qText = document.getElementById('newQText')?.value?.trim();
        const opt0 = document.getElementById('newQOpt0')?.value?.trim() || '';
        const opt1 = document.getElementById('newQOpt1')?.value?.trim() || '';
        const opt2 = document.getElementById('newQOpt2')?.value?.trim() || '';
        const opt3 = document.getElementById('newQOpt3')?.value?.trim() || '';

        if (!qText || !opt0 || !opt1) {
          window.showStandardDialog({ title: '⚠️ ព័ត៌មានមិនទាន់គ្រប់គ្រាន់', text: 'សូមបញ្ចូលខ្លឹមសារសំណួរ និងជម្រើសចម្លើយឱ្យបានគ្រប់គ្រាន់!', icon: 'warning' });
          return;
        }

        const newQ = {
          id: `custom_${Date.now()}`,
          g: document.getElementById('newQGrade')?.value || 'ថ្នាក់ទី ៨',
          l: document.getElementById('newQLesson')?.value?.trim() || 'មេរៀនទូទៅ',
          p: 'សំណួរបន្ថែមដោយគ្រូ',
          q: qText,
          o: [opt0, opt1, opt2 || 'គ្មាន', opt3 || 'គ្មាន'],
          a: parseInt(document.getElementById('newQCorrect')?.value || '0', 10),
          e: document.getElementById('newQExp')?.value?.trim() || '',
          level: document.getElementById('newQLevel')?.value || 'មធ្យម'
        };

        this.customQuestions.unshift(newQ);
        this.saveCustomQuestions();
        this.renderGradeChips();
        this.renderQuestions();

        if (typeof window.showToast === 'function') {
          window.showToast('✅ បានបន្ថែមសំណួរថ្មីដោយជោគជ័យ!');
        }
      }
    });
  }

  /* ================== IMPORT EXCEL ================== */
  openImportExcelModal() {
    window.showStandardDialog({
      title: '📤 នាំចូលសំណួរពី Excel / CSV',
      html: `
        <div class="py-2 text-center space-y-4">
          <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">
            📊
          </div>
          <p class="text-xs text-slate-500">
            លោកគ្រូអាចទាញយកគំរូឯកសារ Excel (Template) បំពេញសំណួរ រួច Upload បញ្ចូលមកវិញបានដោយងាយស្រួល។
          </p>
          <div class="flex items-center justify-center gap-3">
            <button onclick="window.questionBank.downloadExcelTemplate()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300">
              <i class="fa-solid fa-download text-emerald-600"></i> ទាញយកគំរូ Excel Template
            </button>
          </div>
          <div class="pt-2">
            <input type="file" id="excelUploadFileInput" accept=".xlsx, .xls, .csv" class="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer">
          </div>
        </div>
      `,
      icon: 'info',
      confirmText: '📤 នាំចូលទិន្នន័យ',
      onConfirm: () => {
        const fileInput = document.getElementById('excelUploadFileInput');
        if (fileInput && fileInput.files && fileInput.files[0]) {
          this.handleExcelFile(fileInput.files[0]);
        } else {
          window.showStandardDialog({ title: '⚠️ មិនទាន់មានឯកសារ', text: 'សូមជ្រើសរើសឯកសារ Excel មួយជាមុនសិន!', icon: 'warning' });
        }
      }
    });
  }

  downloadExcelTemplate() {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Grade,Lesson,Question,OptionA,OptionB,OptionC,OptionD,CorrectIndex,Explanation\n" +
      "ថ្នាក់ទី ៨,មេរៀនទី ១ ៖ ចំនួនសនិទាន,គណនា $ -\\frac{2}{3} + \\frac{5}{6} $,1/6,-1/6,1/2,7/6,0,តម្រូវភាគបែងរួម 6: (-4+5)/6 = 1/6\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "NGS_Question_Bank_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  handleExcelFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let rows = [];
        if (typeof XLSX !== 'undefined') {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          rows = XLSX.utils.sheet_to_json(firstSheet);
        } else {
          const text = new TextDecoder('utf-8').decode(e.target.result);
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          const headers = lines[0].split(',').map(h => h.trim());
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            const row = {};
            headers.forEach((h, idx) => row[h] = cols[idx] || '');
            rows.push(row);
          }
        }

        let importedCount = 0;
        rows.forEach(r => {
          const qText = r.Question || r.question || r['សំណួរ'];
          if (qText) {
            const optA = r.OptionA || r.optionA || r['ជម្រើសA'] || 'A';
            const optB = r.OptionB || r.optionB || r['ជម្រើសB'] || 'B';
            const optC = r.OptionC || r.optionC || r['ជម្រើសC'] || 'C';
            const optD = r.OptionD || r.optionD || r['ជម្រើសD'] || 'D';
            const corr = parseInt(r.CorrectIndex || r.correctIndex || r['ចម្លើយ'] || '0', 10);

            this.customQuestions.unshift({
              id: `imported_${Date.now()}_${importedCount}`,
              g: r.Grade || r.grade || r['ថ្នាក់'] || 'ថ្នាក់ទី ៨',
              l: r.Lesson || r.lesson || r['មេរៀន'] || 'មេរៀននាំចូល',
              p: 'សំណួរនាំចូល',
              q: qText,
              o: [optA, optB, optC, optD],
              a: isNaN(corr) ? 0 : corr,
              e: r.Explanation || r.explanation || r['ពន្យល់'] || '',
              level: 'មធ្យម'
            });
            importedCount++;
          }
        });

        this.saveCustomQuestions();
        this.renderGradeChips();
        this.renderQuestions();
        window.showStandardDialog({ title: '✅ នាំចូលជោគជ័យ', text: `បាននាំចូលជោគជ័យ ${importedCount} សំណួរ!`, icon: 'success' });
      } catch (err) {
        window.showStandardDialog({ title: '❌ បរាជ័យក្នុងការអានឯកសារ', text: 'មានបញ្ហាក្នុងការអានឯកសារ Excel: ' + err.message, icon: 'error' });
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

window.questionBank = new QuestionBankController();

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('tab-questionbank')) {
    window.questionBank.init();
  }
});
