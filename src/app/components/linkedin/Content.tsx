import React from 'react';
import { ArrowDropDown, Bookmark, Event, Groups, MoreHoriz, Newspaper, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getExperiencePeriod, getPortfolioData, getProjectDate, getSkillGroups } from '@/src/services/portfolioData';

const data = getPortfolioData();
const education = data.education[0];
const skillGroups = getSkillGroups();

const posts = [
    ...data.experience.map((item) => ({
        id: item.id,
        title: `${item.role} at ${item.company}`,
        subtitle: `${item.location} | ${getExperiencePeriod(item)}`,
        content: item.highlights.join(' '),
        image: `https://picsum.photos/seed/${item.id}/900/520`,
        metrics: `${item.tech_stack.length} technologies | ${item.highlights.length} highlights`,
        tag: 'Experience',
    })),
    ...data.projects.map((project) => ({
        id: project.id,
        title: project.name,
        subtitle: `${project.status} | ${getProjectDate(project)}`,
        content: `${project.tagline} ${project.description}`,
        image: `https://picsum.photos/seed/${project.id}/900/520`,
        metrics: project.tech_stack.join(' | '),
        tag: 'Project',
    })),
    ...data.achievements.map((achievement) => ({
        id: achievement.id,
        title: achievement.title,
        subtitle: `${achievement.issuer} | ${achievement.year}`,
        content: achievement.description || `${achievement.type} recognition from ${achievement.issuer}.`,
        image: `https://picsum.photos/seed/${achievement.id}/900/520`,
        metrics: achievement.type,
        tag: 'Achievement',
    })),
];

const Content = () => {
    return (
        <div className="flex w-full h-full pt-5 max-sm:pt-2">
            <div className="w-1/4 max-sm:hidden flex flex-col ml-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col bg-white rounded-md items-start w-[230px] self-end border border-gray-300 overflow-hidden"
                >
                    <div className="w-full h-20 bg-gradient-to-r from-[#0a66c2] to-[#00a884]" />
                    <img
                        src={data.meta.avatar}
                        alt={data.meta.name}
                        className="w-18 h-18 rounded-full border-2 border-white ml-3 -mt-10 object-cover"
                    />
                    <div className='w-full pb-3 px-5 text-xs'>
                        <h2 className="text-lg font-semibold mt-2">{data.meta.name}</h2>
                        <p className="text-gray-700 font-medium">{data.meta.tagline}</p>
                        <p className="text-gray-500 mt-1">{education.institution}</p>
                    </div>
                </motion.div>

                <div className="flex flex-col p-4 text-xs bg-white rounded-md items-start w-[230px] self-end border border-gray-300 mt-2">
                    <div className="flex w-full justify-between text-gray-600">
                        <span className='font-semibold'>Projects</span>
                        <span className="font-semibold text-[#0a66c2]">{data.projects.length}</span>
                    </div>
                    <div className="flex w-full justify-between text-gray-600 mt-2">
                        <span className='font-semibold'>Achievements</span>
                        <span className="font-semibold text-[#0a66c2]">{data.achievements.length}</span>
                    </div>
                </div>

                <div className="flex flex-col p-4 bg-white rounded-md items-start w-[230px] self-end border border-gray-300 mt-2">
                    <ul className="space-y-2 text-xs font-medium text-[rgb(0,0,0,0.9)]">
                        <li className="flex items-center"><Bookmark sx={{ fontSize: "18px" }} className="mr-2" /> Featured projects</li>
                        <li className="flex items-center"><Groups sx={{ fontSize: "18px" }} className="mr-2" /> Open source</li>
                        <li className="flex items-center"><Newspaper sx={{ fontSize: "18px" }} className="mr-2" /> Experience</li>
                        <li className="flex items-center"><Event sx={{ fontSize: "18px" }} className="mr-2" /> Achievements</li>
                    </ul>
                </div>
            </div>

            <div className="flex-1 max-sm:w-full px-6 max-sm:px-1">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-2 border border-gray-300 rounded-md"
                >
                    <span className='w-full px-2 flex gap-1'>
                        <img src={data.meta.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white" />
                        <input
                            type="text"
                            placeholder={`Ask about ${data.meta.name}'s work`}
                            className="w-full text-sm rounded-full h-fit p-3 self-center placeholder:font-medium placeholder:text-gray-800 px-5 border border-gray-400 outline-none"
                        />
                    </span>
                    <div className="flex justify-around text-sm text-gray-600">
                        <button className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg">Portfolio</button>
                        <button className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg">Projects</button>
                        <button className="flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg">Resume</button>
                    </div>
                </motion.div>

                <span className='w-full flex gap-2 items-center text-[12px] text-nowrap my-2 text-gray-600'>
                    <p className='w-full border-t border-gray-400' />
                    Sort by:
                    <p className='font-semibold flex items-center'>Portfolio relevance <ArrowDropDown sx={{ fontSize: "2em" }} /></p>
                </span>

                {posts.map((post, index) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="bg-white border border-gray-300 rounded-md mb-4 max-sm:mb-2"
                    >
                        <div className="flex items-center px-5 pt-5 max-sm:px-2 max-sm:w-full">
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center self-baseline overflow-hidden">
                                <img src={data.meta.avatar} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-2 max-sm:ml-3 max-sm:w-2/3">
                                <h3 className="text-sm font-semibold">{post.title}</h3>
                                <p className="text-xs text-gray-500 truncate">{post.subtitle}</p>
                                <p className="text-xs text-gray-500">{post.tag} | Follow</p>
                            </div>
                            <span className='ml-auto cursor-pointer hover:bg-gray-100 rounded-full p-1 self-start'>
                                <MoreHoriz className='text-[rgb(0,0,0,0.6)]' />
                            </span>
                        </div>
                        <p className="mt-2 max-sm:px-2 px-5 p-1 text-sm leading-6">{post.content}</p>
                        <img src={post.image} alt={post.title} className="w-full mt-2 aspect-[16/9] object-cover" />
                        <div className='w-full flex justify-between px-3 py-2 text-xs text-gray-800'>
                            <span className='font-medium text-[#0a66c2]'>{post.metrics}</span>
                            <span>{index + 7} comments | {index + 3} reposts</span>
                        </div>
                    </motion.article>
                ))}
            </div>

            <div className="w-1/3 max-sm:hidden pr-3 flex flex-col">
                <div className="w-[300px] pb-5 bg-white rounded-md border border-gray-300">
                    <div className='w-full px-4 pt-3 pb-1'>
                        <h3 className="text-lg font-semibold">Skill Groups</h3>
                        <p className="text-sm text-gray-500 mt-1 font-semibold">from myData.json</p>
                    </div>
                    <ul className="flex flex-col gap-2 text-sm text-gray-800">
                        {skillGroups.map((group) => (
                            <li key={group.label} className="flex flex-col cursor-pointer p-4 py-1 hover:bg-[rgba(0,0,0,0.08)]">
                                <span className="font-semibold">{group.label}</span>
                                <span className="text-gray-500 text-xs">{group.items.slice(0, 4).join(' | ')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='w-[300px] flex h-fit px-2 p-1 border border-gray-300 items-center absolute bottom-0 right-6 bg-white rounded-t-xl shadow-xl'>
                    <img src={data.meta.avatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                    <span className='bg-[#01754f] w-[18px] h-[10px] rounded-full self-end -ml-3 mb-0.5 border-2 border-white' />
                    <p className='px-3 font-semibold text-gray-700 text-sm'>Message {data.meta.name.split(' ')[0]}</p>
                    <span className='ml-auto'><Person sx={{ fontSize: 18 }} /></span>
                </div>
            </div>
        </div>
    );
};

export default Content;
